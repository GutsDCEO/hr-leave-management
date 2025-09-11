package com.hrpfa.hr_pfa.attendance.service;

import com.hrpfa.hr_pfa.attendance.dto.AttendanceDTO;
import com.hrpfa.hr_pfa.attendance.model.Attendance;
import com.hrpfa.hr_pfa.attendance.repository.AttendanceRepository;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserService userService;

    public AttendanceDTO clockIn(String userEmail) {
        User user = userService.getUserByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate today = LocalDate.now();

        Optional<Attendance> existingAttendance = attendanceRepository.findByUserAndAttendanceDate(user, today);

        if (existingAttendance.isPresent() && existingAttendance.get().getClockIn() != null) {
            throw new IllegalStateException("You have already clocked in today.");
        }

        Attendance attendance = Attendance.builder()
                .user(user)
                .attendanceDate(today)
                .clockIn(LocalTime.now())
                .build();

        return convertToDTO(attendanceRepository.save(attendance));
    }

    public AttendanceDTO clockOut(String userEmail) {
        User user = userService.getUserByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByUserAndAttendanceDate(user, today)
                .orElseThrow(() -> new IllegalStateException("You must clock in before clocking out."));

        if (attendance.getClockOut() != null) {
            throw new IllegalStateException("You have already clocked out today.");
        }

        attendance.setClockOut(LocalTime.now());
        return convertToDTO(attendanceRepository.save(attendance));
    }

    public List<AttendanceDTO> getMyAttendance(String userEmail) {
        User user = userService.getUserByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserOrderByAttendanceDateDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .userId(attendance.getUser().getId())
                .attendanceDate(attendance.getAttendanceDate())
                .clockIn(attendance.getClockIn())
                .clockOut(attendance.getClockOut())
                .build();
    }
}

