package com.hrpfa.hr_pfa.leave.controller;

import com.hrpfa.hr_pfa.leave.dto.BulkActionRequestDTO;
import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import com.hrpfa.hr_pfa.leave.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@PreAuthorize("hasRole('ADMIN')")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    public Page<LeaveResponseDTO> listLeaves(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long employeeId,
            Pageable pageable
    ) {
        return leaveService.getLeaves(status, startDate, endDate, employeeId, pageable);
    }

    @PostMapping("/{id}/approve")
    public LeaveResponseDTO approveLeave(@PathVariable Long id, @RequestParam String reviewer) {
        return leaveService.approveLeave(id, reviewer);
    }

    @PostMapping("/{id}/reject")
    public LeaveResponseDTO rejectLeave(@PathVariable Long id, @RequestParam String reviewer, @RequestParam String reason) {
        return leaveService.rejectLeave(id, reviewer, reason);
    }

    @PostMapping("/bulk-approve")
    public List<LeaveResponseDTO> bulkApprove(@RequestBody BulkActionRequestDTO request) {
        return leaveService.bulkApprove(request.getLeaveIds(), request.getReviewer());
    }

    @PostMapping("/bulk-reject")
    public List<LeaveResponseDTO> bulkReject(@RequestBody BulkActionRequestDTO request) {
        return leaveService.bulkReject(request.getLeaveIds(), request.getReviewer(), request.getComment());
    }
}
