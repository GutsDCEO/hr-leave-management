package com.hrpfa.hr_pfa.user.controller;

import com.hrpfa.hr_pfa.exceptions.UserAlreadyExistsException;
import com.hrpfa.hr_pfa.user.dto.UserDTO;
import com.hrpfa.hr_pfa.user.dto.UserRoleUpdateDTO;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.hrpfa.hr_pfa.config.SecurityConfig;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        try {
            User user = convertToEntity(userDTO);
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(createdUser));
        } catch (UserAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UserRoleUpdateDTO roleUpdateDTO
    ) {
        User updatedUser = userService.updateUserRole(userId, roleUpdateDTO.getNewRole());
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

//    fetching all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(userDTOs);
    }


    // Temporary endpoint to generate BCrypt hash

    @GetMapping("/hash-password")
    public String hashPassword(@RequestParam String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    // Helper methods
    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        return user;
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
