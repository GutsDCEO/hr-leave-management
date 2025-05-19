package com.hrpfa.hr_pfa.leave.model;

public enum LeaveStatus {
    PENDING,    // Initial status when leave is submitted
    APPROVED,   // When manager approves the leave
    REJECTED,   // When manager rejects the leave
    CANCELLED   // When employee cancels their own leave
}
