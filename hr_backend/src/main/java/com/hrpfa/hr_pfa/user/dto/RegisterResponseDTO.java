package com.hrpfa.hr_pfa.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String adminCode;
    private String role;
    private String token; // JWT token for immediate login after registration
}
