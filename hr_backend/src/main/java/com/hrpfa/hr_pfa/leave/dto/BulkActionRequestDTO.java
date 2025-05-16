package com.hrpfa.hr_pfa.leave.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkActionRequestDTO {

    private List<Long> leaveIds;
    private String reviewer;
    private String comment;
}
