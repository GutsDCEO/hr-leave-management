package com.hrpfa.hr_pfa.leave.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class LeaveResponseDTO {

    private Long id;
    private String employeeName;
    private String employeeEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private String status;
    private String reason;
    private String reviewer;
    private LocalDateTime reviewedAt;
}
