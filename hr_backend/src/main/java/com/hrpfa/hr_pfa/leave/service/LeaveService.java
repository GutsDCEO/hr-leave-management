package com.hrpfa.hr_pfa.leave.service;

import com.hrpfa.hr_pfa.leave.dto.LeaveRequestDTO;
import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import com.hrpfa.hr_pfa.leave.model.LeaveType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface LeaveService {
    // Admin methods
    Page<LeaveResponseDTO> getLeaves(String status, LocalDate startDate, LocalDate endDate, Long employeeId, Pageable pageable);
    LeaveResponseDTO approveLeave(Long leaveId, String reviewer);
    LeaveResponseDTO rejectLeave(Long leaveId, String reviewer, String reason);
    List<LeaveResponseDTO> bulkApprove(List<Long> leaveIds, String reviewer);
    List<LeaveResponseDTO> bulkReject(List<Long> leaveIds, String reviewer, String reason);
    
    // Employee methods
    LeaveResponseDTO submitLeave(LeaveRequestDTO request, String email);
    Page<LeaveResponseDTO> getEmployeeLeaveRequests(String email, Pageable pageable);
    LeaveResponseDTO getEmployeeLeaveRequest(Long id, String email);
    void cancelLeaveRequest(Long id, String email, boolean isAdmin);
    
    // Leave history and balance methods
    Page<LeaveResponseDTO> getEmployeeLeaveHistory(String email, String status, LocalDate fromDate, 
                                                 LocalDate toDate, Pageable pageable);
    Map<String, Integer> getEmployeeLeaveBalance(String email);
    
    // Validation methods
    /**
     * Check if the employee has sufficient leave balance for the requested leave type
     * @param email Employee's email address
     * @param leaveType Type of leave (as string to be converted to enum)
     * @param daysRequested Number of days requested
     * @return true if sufficient balance, false otherwise
     */
    boolean hasSufficientLeaveBalance(String email, String leaveType, int daysRequested);
    boolean hasOverlappingLeaves(String email, LocalDate startDate, LocalDate endDate);
}
