package com.hrpfa.hr_pfa.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required (min 6 characters)")
    @Pattern(regexp = "^.{6,}$", message = "Password must be at least 6 characters")
    private String password; // Only used for creation (write-only)

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "EMPLOYEE|MANAGER|ADMIN", message = "Invalid role")
    private String role;
}
