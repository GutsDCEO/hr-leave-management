package com.hrpfa.hr_pfa.dashboard.service;

import com.hrpfa.hr_pfa.dashboard.dto.DashboardStatsDTO;
import com.hrpfa.hr_pfa.leave.model.LeaveStatus;
import com.hrpfa.hr_pfa.leave.repository.LeaveRepository;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final LeaveRepository leaveRepository;

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalEmployees = userRepository.count();
        long pendingLeaveRequests = leaveRepository.countByStatus(LeaveStatus.PENDING);

        // Define the date range for the current month
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(LocalTime.MAX);

        // Fetch month-specific stats
        long approvedThisMonth = leaveRepository.countByStatusAndRequestedAtBetween(LeaveStatus.APPROVED, startOfMonth, endOfMonth);
        long rejectedThisMonth = leaveRepository.countByStatusAndRequestedAtBetween(LeaveStatus.REJECTED, startOfMonth, endOfMonth);
        long totalThisMonth = approvedThisMonth + rejectedThisMonth + leaveRepository.countByStatusAndRequestedAtBetween(LeaveStatus.PENDING, startOfMonth, endOfMonth);

        // Calculate approval rate, avoiding division by zero
        double approvalRate = (approvedThisMonth + rejectedThisMonth) == 0 ? 0.0 : 
                              ((double) approvedThisMonth / (approvedThisMonth + rejectedThisMonth)) * 100;

        return new DashboardStatsDTO(
                totalEmployees,
                pendingLeaveRequests,
                approvedThisMonth,
                rejectedThisMonth,
                totalThisMonth,
                approvalRate
        );
    }
}
