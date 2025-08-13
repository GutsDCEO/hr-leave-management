package com.hrpfa.hr_pfa.admin.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListItemDTO {
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
}
