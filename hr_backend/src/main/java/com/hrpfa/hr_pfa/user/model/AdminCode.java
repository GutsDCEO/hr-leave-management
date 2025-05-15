package com.hrpfa.hr_pfa.user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class AdminCode {
    @Id
    private Long id = 1L; // singleton row
    private String code;
}
