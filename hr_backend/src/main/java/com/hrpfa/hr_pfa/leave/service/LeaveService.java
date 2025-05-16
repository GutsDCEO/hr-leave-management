package com.hrpfa.hr_pfa.leave.service;

import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface LeaveService {

    Page<LeaveResponseDTO> getLeaves(String status, LocalDate startDate, LocalDate endDate, Long employeeId, Pageable pageable);
    LeaveResponseDTO approveLeave(Long leaveId, String reviewer);
    LeaveResponseDTO rejectLeave(Long leaveId, String reviewer, String reason);
    List<LeaveResponseDTO> bulkApprove(List<Long> leaveIds, String reviewer);
    List<LeaveResponseDTO> bulkReject(List<Long> leaveIds, String reviewer, String reason);
}
