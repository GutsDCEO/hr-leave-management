package com.hrpfa.hr_pfa.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.hrpfa.hr_pfa.user.model.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String firstName;
    private String lastName;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;
    
    private String department;
    private String position;
    private String avatarUrl;

    private UserPreferencesDTO preferences;

    // New added :

    public static UserProfileDTO fromUser(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setPosition(user.getPosition());
        dto.setAvatarUrl(user.getAvatarUrl());

        // Note: You will need to implement a way to map the UserPreference entities to a UserPreferencesDTO
        // For now, a placeholder is used.
        UserPreferencesDTO userPreferencesDTO = new UserPreferencesDTO();
        // userPreferencesDTO.setEmailNotificationsEnabled(...);
        // userPreferencesDTO.setPreferredTheme(...);
        dto.setPreferences(userPreferencesDTO);

        return dto;
    }
}
