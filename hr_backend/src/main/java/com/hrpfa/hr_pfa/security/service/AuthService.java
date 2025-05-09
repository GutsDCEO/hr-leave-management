package com.hrpfa.hr_pfa.security.service;

import com.hrpfa.hr_pfa.security.models.AuthResponse;

public interface AuthService {
    AuthResponse login(String email, String password);
    String getUserRole(String email);
}
