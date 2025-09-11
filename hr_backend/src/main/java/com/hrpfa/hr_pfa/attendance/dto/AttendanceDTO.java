package com.hrpfa.hr_pfa.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Long id;
    private Long userId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate attendanceDate;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime clockIn;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime clockOut;
}
