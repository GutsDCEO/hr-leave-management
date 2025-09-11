package com.hrpfa.hr_pfa.attendance.controller;

import com.hrpfa.hr_pfa.attendance.dto.AttendanceDTO;
import com.hrpfa.hr_pfa.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            AttendanceDTO attendance = attendanceService.clockIn(email);
            return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to clock in.");
        }
    }

    @PostMapping("/clock-out")
    public ResponseEntity<?> clockOut() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            AttendanceDTO attendance = attendanceService.clockOut(email);
            return ResponseEntity.ok(attendance);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to clock out.");
        }
    }

    @GetMapping("/my-attendance")
    public ResponseEntity<List<AttendanceDTO>> getMyAttendance() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        List<AttendanceDTO> attendanceRecords = attendanceService.getMyAttendance(email);
        return ResponseEntity.ok(attendanceRecords);
    }
}

