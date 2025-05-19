package com.hrpfa.hr_pfa.leave.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hrpfa.hr_pfa.leave.model.LeaveStatus;
import com.hrpfa.hr_pfa.leave.model.LeaveType;
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
    private Long employeeId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    private LeaveType type;
    private LeaveStatus status;
    private String reason;
    private String reviewer;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime requestedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewedAt;
    
    private String rejectionReason;
    private Integer workingDays;
    
    // Additional calculated fields that might be useful in the response
    private String statusDisplay;
    private String typeDisplay;
    
    public String getStatusDisplay() {
        return status != null ? status.toString() : null;
    }
    
    public String getTypeDisplay() {
        return type != null ? type.toString() : null;
    }
}
