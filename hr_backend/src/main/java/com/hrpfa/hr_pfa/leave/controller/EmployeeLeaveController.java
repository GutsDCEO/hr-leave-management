package com.hrpfa.hr_pfa.leave.controller;

import com.hrpfa.hr_pfa.leave.dto.LeaveRequestDTO;
import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import com.hrpfa.hr_pfa.leave.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/leaves")
@PreAuthorize("hasRole('EMPLOYEE')")
@Tag(name = "Employee Leave Management", description = "APIs for employees to manage their leave requests")
public class EmployeeLeaveController {

    private final LeaveService leaveService;

    @Autowired
    public EmployeeLeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    @Operation(summary = "Submit a new leave request")
    public ResponseEntity<LeaveResponseDTO> submitLeaveRequest(
            @Valid @RequestBody LeaveRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        LeaveResponseDTO response = leaveService.submitLeave(request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get current user's leave requests")
    public ResponseEntity<Page<LeaveResponseDTO>> getMyLeaveRequests(
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        Page<LeaveResponseDTO> response = leaveService.getEmployeeLeaveRequests(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific leave request by ID")
    public ResponseEntity<LeaveResponseDTO> getLeaveRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        LeaveResponseDTO response = leaveService.getEmployeeLeaveRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/balance")
    @Operation(summary = "Get current user's leave balance")
    public ResponseEntity<Map<String, Integer>> getLeaveBalance(
            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Integer> balance = leaveService.getEmployeeLeaveBalance(userDetails.getUsername());
        return ResponseEntity.ok(balance);
    }
    
    @GetMapping("/balance/{leaveType}")
    @Operation(summary = "Get current user's leave balance for a specific leave type")
    public ResponseEntity<Map<String, Object>> getLeaveBalanceByType(
            @PathVariable String leaveType,
            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Integer> balance = leaveService.getEmployeeLeaveBalance(userDetails.getUsername());
        int availableDays = balance.getOrDefault(leaveType.toUpperCase(), 0);
        
        Map<String, Object> response = new HashMap<>();
        response.put("leaveType", leaveType);
        response.put("availableDays", availableDays);
        response.put("canRequest", availableDays > 0 || "UNPAID".equalsIgnoreCase(leaveType));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/history")
    @Operation(summary = "Get current user's leave history with pagination and filtering")
    public ResponseEntity<Page<LeaveResponseDTO>> getLeaveHistory(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDate,desc") String[] sort,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
        Page<LeaveResponseDTO> leaveHistory = leaveService.getEmployeeLeaveHistory(
            userDetails.getUsername(), status, fromDate, toDate, pageable);
            
        return ResponseEntity.ok(leaveHistory);
    }
    
    private List<Sort.Order> parseSort(String[] sort) {
        List<Sort.Order> orders = new ArrayList<Sort.Order>();
        if (sort[0].contains(",")) {
            // Will sort more than 2 fields
            for (String sortOrder : sort) {
                String[] _sort = sortOrder.split(",");
                orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
            }
        } else {
            // Sort by a single field
            orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
        }
        return orders;
    }
    
    private Sort.Direction getSortDirection(String direction) {
        if (direction.equals("asc")) {
            return Sort.Direction.ASC;
        } else if (direction.equals("desc")) {
            return Sort.Direction.DESC;
        }
        return Sort.Direction.ASC;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a pending leave request")
    public ResponseEntity<Void> cancelLeaveRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        leaveService.cancelLeaveRequest(id, userDetails.getUsername(), false);
        return ResponseEntity.noContent().build();
    }
}
