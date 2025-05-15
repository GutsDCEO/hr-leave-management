package com.hrpfa.hr_pfa.security.service;

import com.hrpfa.hr_pfa.security.models.AuthResponse;
import com.hrpfa.hr_pfa.user.dto.RegisterResponseDTO;
import com.hrpfa.hr_pfa.user.dto.RegisterUserDTO;

public interface AuthService {
    AuthResponse login(String email, String password);
    RegisterResponseDTO register(RegisterUserDTO registerUserDTO);
    String getUserRole(String email);
}
