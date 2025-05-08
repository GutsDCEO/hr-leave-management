package com.hrpfa.hr_pfa.user.service;

import com.hrpfa.hr_pfa.exceptions.InvalidRoleException;
import com.hrpfa.hr_pfa.exceptions.UserAlreadyExistsException;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User createUser(User user) {
        // Check for existing email
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered: " + user.getEmail());
        }

        // Validate role
        if (!isValidRole(user.getRole())) {
            throw new InvalidRoleException("Invalid role: " + user.getRole());
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!isValidRole(newRole)) {
            throw new InvalidRoleException("Invalid role: " + newRole);
        }

        user.setRole(newRole);
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Helper method for role validation
    private boolean isValidRole(String role) {
        return role != null &&
                (role.equals("EMPLOYEE") || role.equals("MANAGER") || role.equals("ADMIN"));
    }
}
