package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface LeaveRepositoryCustom {
    Page<LeaveRequest> findFiltered(String status, Long employeeId, LocalDate startDate, LocalDate endDate, Pageable pageable);
}
