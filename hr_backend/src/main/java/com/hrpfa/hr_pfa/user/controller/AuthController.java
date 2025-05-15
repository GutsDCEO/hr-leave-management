package com.hrpfa.hr_pfa.user.controller;

import com.hrpfa.hr_pfa.exceptions.UserAlreadyExistsException;
import com.hrpfa.hr_pfa.security.models.AuthRequest;
import com.hrpfa.hr_pfa.security.models.AuthResponse;
import com.hrpfa.hr_pfa.security.service.AuthService;
import com.hrpfa.hr_pfa.user.dto.RegisterResponseDTO;
import com.hrpfa.hr_pfa.user.dto.RegisterUserDTO;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}
