package com.hrpfa.hr_pfa.leave.service;

import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import com.hrpfa.hr_pfa.leave.repository.LeaveRepository;
import com.hrpfa.hr_pfa.leave.validation.LeavePolicyValidator;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveServiceImpl implements LeaveService {

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
        if (!"PENDING".equals(leave.getStatus())) {
            throw new IllegalStateException("Leave request is not pending");
        }
        leave.setStatus("APPROVED");
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
        if (!"PENDING".equals(leave.getStatus())) {
            throw new IllegalStateException("Leave request is not pending");
        }
        leave.setStatus("REJECTED");
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

    // Helper to convert entity to DTO
    private LeaveResponseDTO toDto(LeaveRequest leave) {
        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setId(leave.getId());
        dto.setEmployeeName(leave.getUser().getFirstName() + " " + leave.getUser().getLastName());
        dto.setEmployeeEmail(leave.getUser().getEmail());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setType(leave.getType());
        dto.setStatus(leave.getStatus());
        dto.setReason(leave.getReason());
        dto.setReviewer(leave.getReviewer());
        dto.setReviewedAt(leave.getReviewedAt());
        return dto;
    }
}
