package com.hrpfa.hr_pfa.security.service;



import com.hrpfa.hr_pfa.security.jwt.JwtUtil;
import com.hrpfa.hr_pfa.security.models.AuthResponse;
import com.hrpfa.hr_pfa.user.dto.RegisterResponseDTO;
import com.hrpfa.hr_pfa.user.dto.RegisterUserDTO;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import com.hrpfa.hr_pfa.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserService userService ;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole());
    }

    @Override
    public RegisterResponseDTO register(RegisterUserDTO registerUserDTO) {
        // Register the user through UserService
        User registeredUser = userService.registerUser(registerUserDTO);

        // Generate JWT token for immediate login
        String token = jwtUtil.generateToken(registeredUser);

        // Create and return response DTO
        return RegisterResponseDTO.builder()
                .id(registeredUser.getId())
                .email(registeredUser.getEmail())
                .firstName(registeredUser.getFirstName())
                .lastName(registeredUser.getLastName())
                .role(registeredUser.getRole())
                .token(token)
                .build();
    }

    @Override
    public String getUserRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        return user.getRole();
    }

}
