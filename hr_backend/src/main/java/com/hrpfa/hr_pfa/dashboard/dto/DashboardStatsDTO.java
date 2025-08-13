package com.hrpfa.hr_pfa.dashboard.dto;

/**
 * DTO for Dashboard Statistics.
 * This record is an immutable data carrier, used to transfer data between the service and controller layers,
 * and ultimately to the frontend. It encapsulates the key metrics required for the admin dashboard.
 */
public record DashboardStatsDTO(
    long totalEmployees,
    long pendingLeaveRequests,
    long approvedLeaveRequestsThisMonth,
    long rejectedLeaveRequestsThisMonth,
    long totalLeaveRequestsThisMonth,
    double approvalRateThisMonth
) {}
