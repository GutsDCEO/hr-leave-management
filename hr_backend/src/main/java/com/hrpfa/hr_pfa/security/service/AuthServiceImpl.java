package com.hrpfa.hr_pfa.security.service;



import com.hrpfa.hr_pfa.security.jwt.JwtUtil;
import com.hrpfa.hr_pfa.security.models.AuthResponse;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
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
    public String getUserRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        return user.getRole();
    }

}
