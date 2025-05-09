package com.hrpfa.hr_pfa.security.models;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
