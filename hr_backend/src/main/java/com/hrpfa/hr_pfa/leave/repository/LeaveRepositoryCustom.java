package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRepositoryCustom {
    Page<LeaveRequest> findFiltered(String status, Long employeeId, LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    /**
     * Check if there are any overlapping leave requests for the given user and date range
     * @param userId The ID of the user
     * @param startDate Start date of the leave period
     * @param endDate End date of the leave period
     * @param statuses List of statuses to check against
     * @return Number of overlapping leave requests
     */
    long hasOverlappingLeaves(Long userId, LocalDate startDate, LocalDate endDate, List<String> statuses);
}
