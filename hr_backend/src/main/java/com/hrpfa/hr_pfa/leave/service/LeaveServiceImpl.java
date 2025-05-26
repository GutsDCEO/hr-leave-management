package com.hrpfa.hr_pfa.leave.service;

import com.hrpfa.hr_pfa.exceptions.LeaveRequestException;
import com.hrpfa.hr_pfa.exceptions.ResourceNotFoundException;
import com.hrpfa.hr_pfa.leave.dto.LeaveRequestDTO;
import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import com.hrpfa.hr_pfa.leave.model.LeaveStatus;
import com.hrpfa.hr_pfa.leave.model.LeaveType;
import com.hrpfa.hr_pfa.leave.repository.LeaveRepository;
import com.hrpfa.hr_pfa.leave.validation.LeavePolicyValidator;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import jakarta.persistence.criteria.Predicate;

@Service
@Slf4j
public class LeaveServiceImpl implements LeaveService {
    
    private static final int MIN_LEAVE_NOTICE_DAYS = 1; // Minimum days notice required for leave
    private static final int MAX_LEAVE_DAYS = 30; // Maximum consecutive leave days allowed

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeavePolicyValidator leavePolicyValidator;

    @Override
    public Page<LeaveResponseDTO> getLeaves(String status, LocalDate startDate, LocalDate endDate, Long employeeId, Pageable pageable) {
        return leaveRepository.findFiltered(status, employeeId, startDate, endDate, pageable)
                .map(this::toDto);
    }

    @Override
    @Transactional
    public LeaveResponseDTO approveLeave(Long leaveId, String reviewer) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found"));
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not pending");
        }
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setReviewer(reviewer);
        leave.setReviewedAt(java.time.LocalDateTime.now());
        leaveRepository.save(leave);
        return toDto(leave);
    }

    @Override
    @Transactional
    public LeaveResponseDTO rejectLeave(Long leaveId, String reviewer, String reason) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found"));
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not pending");
        }
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setReviewer(reviewer);
        leave.setReviewedAt(java.time.LocalDateTime.now());
        leave.setRejectionReason(reason);
        leaveRepository.save(leave);
        return toDto(leave);
    }

    @Override
    @Transactional
    public List<LeaveResponseDTO> bulkApprove(List<Long> leaveIds, String reviewer) {
        return leaveIds.stream()
                .map(id -> approveLeave(id, reviewer))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<LeaveResponseDTO> bulkReject(List<Long> leaveIds, String reviewer, String reason) {
        return leaveIds.stream()
                .map(id -> rejectLeave(id, reviewer, reason))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LeaveResponseDTO submitLeave(LeaveRequestDTO request, String email) {
        log.info("=== Starting leave submission process for user: {} ===", email);
        log.info("Request details - Start: {}, End: {}, Type: {}, Reason: {}", 
            request.getStartDate(), request.getEndDate(), request.getType(), request.getReason());
        
        try {
            // 1. Find the user by email
            log.info("Looking up user with email: {}", email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        String errorMsg = "User not found with email: " + email;
                        log.error("ERROR: {}", errorMsg);
                        return new UsernameNotFoundException(errorMsg);
                    });
            log.info("Found user: ID={}, Email={}", user.getId(), user.getEmail());
            
            // 2. Validate leave request
            log.info("Validating leave request...");
            validateLeaveRequest(request, user);
            log.info("Leave request validation passed");
            
            // 3. Calculate working days
            long workingDays = calculateWorkingDays(request.getStartDate(), request.getEndDate());
            log.info("Calculated working days: {}", workingDays);
            
            // 4. Check leave balance
            log.info("Checking leave balance...");
            if (!hasSufficientLeaveBalance(email, request.getType().name(), (int) workingDays)) {
                String errorMsg = "Insufficient leave balance for " + request.getType() + " leave";
                log.error("VALIDATION FAILED: {}", errorMsg);
                throw new LeaveRequestException(errorMsg);
            }
            
            // 5. Check for overlapping leaves
            log.info("Checking for overlapping leaves...");
            if (hasOverlappingLeaves(email, request.getStartDate(), request.getEndDate())) {
                String errorMsg = "You already have a leave request for the selected period";
                log.error("VALIDATION FAILED: {}", errorMsg);
                throw new LeaveRequestException(errorMsg);
            }
            
            // 6. Create and save leave request
            log.info("Creating new leave request object...");
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setUser(user);
            leaveRequest.setStartDate(request.getStartDate());
            leaveRequest.setEndDate(request.getEndDate());
            leaveRequest.setType(request.getType());
            leaveRequest.setStatus(LeaveStatus.PENDING);
            leaveRequest.setReason(request.getReason());
            leaveRequest.setRequestedAt(java.time.LocalDateTime.now());
            leaveRequest.setWorkingDays((int) workingDays);
            
            log.info("Attempting to save leave request to database...");
            log.info("LeaveRequest before save: {}", leaveRequest);
            
            // Save and flush immediately
            leaveRequest = leaveRepository.saveAndFlush(leaveRequest);
            log.info("Leave request saved successfully! ID: {}", leaveRequest.getId());
            
            // Verify the save
            final Long savedLeaveRequestId = leaveRequest.getId();
            LeaveRequest savedRequest = leaveRepository.findById(savedLeaveRequestId)
                .orElseThrow(() -> {
                    log.error("CRITICAL: Failed to retrieve saved leave request with ID: {}", savedLeaveRequestId);
                    return new RuntimeException("Failed to verify leave request save");
                });
            log.info("Successfully retrieved saved leave request: {}", savedRequest);
            
            return toDto(leaveRequest);
            
        } catch (Exception e) {
            log.error("!!! ERROR IN submitLeave !!!", e);
            throw e;
        }
    }
    
    @Override
    public Page<LeaveResponseDTO> getEmployeeLeaveRequests(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        return leaveRepository.findByUserOrderByStartDateDesc(user, pageable)
                .map(this::toDto);
    }
    
    @Override
    public LeaveResponseDTO getEmployeeLeaveRequest(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        LeaveRequest leaveRequest = leaveRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
                
        return toDto(leaveRequest);
    }
    
    @Override
    @Transactional
    public void cancelLeaveRequest(Long id, String email, boolean isAdmin) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        LeaveRequest leaveRequest = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
                
        // Only allow cancellation if user is the requester or an admin
        if (!isAdmin && !leaveRequest.getUser().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to cancel this leave request");
        }
        
        // Only allow cancellation of pending or approved leaves
        if (leaveRequest.getStatus() != LeaveStatus.PENDING && 
            leaveRequest.getStatus() != LeaveStatus.APPROVED) {
            throw new IllegalStateException("Only pending or approved leaves can be cancelled");
        }
        
        // If it's approved, we might want to return the leave days to the user's balance
        // This is a simplified version - you might need to adjust based on your business logic
        if (leaveRequest.getStatus() == LeaveStatus.APPROVED) {
            // TODO: Implement logic to return leave days to user's balance
        }
        
        leaveRequest.setStatus(LeaveStatus.CANCELLED);
        leaveRequest.setUpdatedAt(LocalDateTime.now());
        leaveRepository.save(leaveRequest);
        
        log.info("Leave request {} cancelled by user: {}", id, email);
    }
    
    @Override
    public Page<LeaveResponseDTO> getEmployeeLeaveHistory(String email, String status, 
            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        
        // Get the user
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        // Create specification for filtering
        Specification<LeaveRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filter by user
            predicates.add(cb.equal(root.get("user").get("id"), user.getId()));
            
            // Filter by status if provided
            if (status != null && !status.isEmpty()) {
                try {
                    LeaveStatus leaveStatus = LeaveStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), leaveStatus));
                } catch (IllegalArgumentException e) {
                    // If invalid status is provided, return no results
                    return cb.and();
                }
            }
            
            // Filter by date range if provided
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), fromDate));
            }
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endDate"), toDate));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        // Add sorting
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                                   Sort.by(Sort.Direction.DESC, "startDate"));
        }
        
        // Fetch paginated results
        Page<LeaveRequest> leavePage = leaveRepository.findAll(spec, pageable);
        
        // Convert to DTOs
        List<LeaveResponseDTO> dtos = leavePage.getContent().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
            
        return new PageImpl<>(dtos, pageable, leavePage.getTotalElements());
    }
    
    @Override
    public Map<String, Integer> getEmployeeLeaveBalance(String username) {
        // TODO: Replace this with actual leave balance calculation from database
        // This is a placeholder implementation
        Map<String, Integer> balance = new HashMap<String, Integer>();
        
        // Default leave balances (in days)
        balance.put("ANNUAL", 20);
        balance.put("SICK", 10);
        balance.put("MATERNITY", 90);
        balance.put("PATERNITY", 14);
        balance.put("UNPAID", 0); // Unlimited, but needs special handling
        balance.put("STUDY", 10);
        balance.put("COMPASSIONATE", 5);
        
        return balance;
    }
    
    @Override
    public boolean hasSufficientLeaveBalance(String username, String leaveTypeStr, int daysRequested) {
        if (leaveTypeStr == null || daysRequested <= 0) {
            return false;
        }
        
        try {
            // Convert the string to uppercase to match the enum constant names
            String normalizedLeaveType = leaveTypeStr.trim().toUpperCase();
            LeaveType leaveType = LeaveType.valueOf(normalizedLeaveType);
            
            // For UNPAID leave, we don't need to check balance
            if (leaveType == LeaveType.UNPAID) {
                return true;
            }
            
            Map<String, Integer> balance = getEmployeeLeaveBalance(username);
            int availableBalance = balance.getOrDefault(leaveType.name(), 0);
            
            // For leave types not in the balance map, assume they're not allowed
            if (availableBalance <= 0) {
                return false;
            }
            
            return daysRequested <= availableBalance;
        } catch (IllegalArgumentException e) {
            return false; // Invalid leave type
        }
    }
    
    @Override
    public boolean hasOverlappingLeaves(String email, LocalDate startDate, LocalDate endDate) {
        // Check if there are any approved or pending leaves in the date range
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        return leaveRepository.hasOverlappingLeaves(
            user.getId(),
            startDate,
            endDate,
            List.of(LeaveStatus.APPROVED.toString(), LeaveStatus.PENDING.toString())
        ) > 0;
    }
    
    private void validateLeaveRequest(LeaveRequestDTO request, User user) {
        // Validate dates
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new LeaveRequestException("Start date and end date are required");
        }
        
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new LeaveRequestException("End date cannot be before start date");
        }
        
        // Validate leave type
        try {
            // No need to convert to uppercase or use valueOf since getType() already returns a LeaveType
            // Just check if the value is not null
            if (request.getType() == null) {
                throw new LeaveRequestException("Leave type is required");
            }
        } catch (IllegalArgumentException e) {
            throw new LeaveRequestException("Invalid leave type: " + request.getType());
        }
        
        // Check minimum notice period
        LocalDate today = LocalDate.now();
        if (request.getStartDate().isBefore(today.plusDays(MIN_LEAVE_NOTICE_DAYS))) {
            throw new LeaveRequestException("Leave request must be submitted at least " + 
                MIN_LEAVE_NOTICE_DAYS + " day(s) in advance");
        }
        
        // Check maximum leave duration
        long daysRequested = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (daysRequested > MAX_LEAVE_DAYS) {
            throw new LeaveRequestException("Maximum leave duration is " + MAX_LEAVE_DAYS + " days");
        }
        
        // Add any additional business rules here
    }
    
    private long calculateWorkingDays(LocalDate startDate, LocalDate endDate) {
        long days = 0;
        LocalDate date = startDate;
        
        while (!date.isAfter(endDate)) {
            // Skip weekends (Saturday=6, Sunday=7 in java.time.DayOfWeek)
            if (date.getDayOfWeek().getValue() < 6) {
                days++;
            }
            date = date.plusDays(1);
        }
        
        return days == 0 ? 1 : days; // At least 1 day
    }

    // Helper to convert entity to DTO
    private LeaveResponseDTO toDto(LeaveRequest leave) {
        if (leave == null) {
            return null;
        }
        
        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setId(leave.getId());
        
        // Set user information
        if (leave.getUser() != null) {
            dto.setEmployeeId(leave.getUser().getId());
            dto.setEmployeeName(
                (leave.getUser().getFirstName() != null ? leave.getUser().getFirstName() + " " : "") + 
                (leave.getUser().getLastName() != null ? leave.getUser().getLastName() : "")
            );
            dto.setEmployeeEmail(leave.getUser().getEmail());
        }
        
        // Set leave details
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setType(leave.getType());
        dto.setStatus(leave.getStatus());
        dto.setReason(leave.getReason());
        dto.setReviewer(leave.getReviewer());
        dto.setRequestedAt(leave.getRequestedAt());
        dto.setUpdatedAt(leave.getUpdatedAt());
        dto.setReviewedAt(leave.getReviewedAt());
        dto.setRejectionReason(leave.getRejectionReason());
        
        // Calculate working days if not already set
        if (leave.getWorkingDays() == null && leave.getStartDate() != null && leave.getEndDate() != null) {
            dto.setWorkingDays((int) calculateWorkingDays(leave.getStartDate(), leave.getEndDate()));
        } else {
            dto.setWorkingDays(leave.getWorkingDays());
        }
        
        return dto;
    }
}
