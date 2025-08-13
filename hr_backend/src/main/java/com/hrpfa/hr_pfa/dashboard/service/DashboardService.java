package com.hrpfa.hr_pfa.dashboard.service;

import com.hrpfa.hr_pfa.dashboard.dto.DashboardStatsDTO;

/**
 * Service interface for dashboard operations.
 * Defines the contract for fetching dashboard metrics.
 */
public interface DashboardService {
    DashboardStatsDTO getDashboardStats();
}
