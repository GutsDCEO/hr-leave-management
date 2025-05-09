package com.hrpfa.hr_pfa.user.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserRoleUpdateDTO {

    @NotBlank(message = "Role cannot be empty")
    @Pattern(regexp = "EMPLOYEE|MANAGER|ADMIN", message = "Invalid role")
    private String newRole;

}
