package com.hrpfa.hr_pfa.leave.validation;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class LeavePolicyValidator {
    // Example: Max allowed leave duration in days
    private static final int MAX_LEAVE_DAYS = 30;

    /**
     * Validates leave duration and overlap with existing leaves.
     * Throws IllegalArgumentException if validation fails.
     */
    public void validate(LeaveRequest request, List<LeaveRequest> existingLeaves) {
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (days <= 0) {
            throw new IllegalArgumentException("Leave end date must be after start date.");
        }
        if (days > MAX_LEAVE_DAYS) {
            throw new IllegalArgumentException("Leave duration exceeds maximum allowed of " + MAX_LEAVE_DAYS + " days.");
        }
        // Check for overlapping leaves
        for (LeaveRequest existing : existingLeaves) {
            if (existing.getStatus().equals("APPROVED") || existing.getStatus().equals("PENDING")) {
                boolean overlaps = !(request.getEndDate().isBefore(existing.getStartDate()) ||
                        request.getStartDate().isAfter(existing.getEndDate()));
                if (overlaps) {
                    throw new IllegalArgumentException("Leave request overlaps with an existing leave from "
                            + existing.getStartDate() + " to " + existing.getEndDate());
                }
            }
        }
    }
}
