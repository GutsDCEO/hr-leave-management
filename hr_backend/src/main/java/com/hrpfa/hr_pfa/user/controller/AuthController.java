package com.hrpfa.hr_pfa.user.controller;

import com.hrpfa.hr_pfa.exceptions.UserAlreadyExistsException;
import com.hrpfa.hr_pfa.security.models.AuthRequest;
import com.hrpfa.hr_pfa.security.models.AuthResponse;
import com.hrpfa.hr_pfa.security.service.AuthService;
import com.hrpfa.hr_pfa.user.dto.RegisterResponseDTO;
import com.hrpfa.hr_pfa.user.dto.RegisterUserDTO;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import com.hrpfa.hr_pfa.user.repository.AdminCodeRepository;
import com.hrpfa.hr_pfa.user.model.AdminCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AdminCodeRepository adminCodeRepository;

    //    Add @Valid annotations to controller methods to enforce constraints (e.g., email format, password strength).
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = authService.login(authRequest.getEmail(), authRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        try {
            RegisterResponseDTO response = authService.register(registerUserDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (UserAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + ex.getMessage());
        }
    }

    // Development endpoint to get admin code (remove in production)
    @GetMapping("/admin-code")
    public ResponseEntity<?> getAdminCode() {
        try {
            AdminCode adminCode = adminCodeRepository.findById(1L).orElse(null);
            if (adminCode != null) {
                return ResponseEntity.ok("Admin code: " + adminCode.getCode());
            } else {
                return ResponseEntity.ok("No admin code found. Please restart the application to generate one.");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving admin code: " + ex.getMessage());
        }
    }
}
