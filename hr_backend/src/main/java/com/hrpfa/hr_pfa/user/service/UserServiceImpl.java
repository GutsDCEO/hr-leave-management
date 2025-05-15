package com.hrpfa.hr_pfa.user.service;

import com.hrpfa.hr_pfa.exceptions.InvalidRoleException;
import com.hrpfa.hr_pfa.exceptions.UserAlreadyExistsException;
import com.hrpfa.hr_pfa.exceptions.UserNotFoundException;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import com.hrpfa.hr_pfa.user.repository.AdminCodeRepository; // [ADMIN CODE] Injected for admin code check
import com.hrpfa.hr_pfa.user.model.AdminCode; // [ADMIN CODE] Model for admin code
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hrpfa.hr_pfa.user.dto.RegisterUserDTO;

import java.util.List;
import java.util.Optional;

@Service

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminCodeRepository adminCodeRepository; // [ADMIN CODE] Injected

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AdminCodeRepository adminCodeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminCodeRepository = adminCodeRepository;
    }

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
    public User registerUser(RegisterUserDTO registerUserDTO) {
        if (userRepository.existsByEmail(registerUserDTO.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + registerUserDTO.getEmail() + " already exists");
        }

        // [ADMIN CODE] Check admin code for role assignment
        String role = registerUserDTO.getRole();
        String adminCodeInput = registerUserDTO.getAdminCode();
        String storedAdminCode = adminCodeRepository.findById(1L).map(AdminCode::getCode).orElse("");
        if (adminCodeInput != null && adminCodeInput.equals(storedAdminCode)) {
            role = "ADMIN";
        } else if (role == null || role.isEmpty()) {
            role = "EMPLOYEE";
        }

        // Create and save user
        User user = User.builder()
                .email(registerUserDTO.getEmail())
                .password(passwordEncoder.encode(registerUserDTO.getPassword()))
                .firstName(registerUserDTO.getFirstName())
                .lastName(registerUserDTO.getLastName())
                .role(role)
                .build();
        // [ADMIN CODE] End logic

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
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // Helper method for role validation
    private boolean isValidRole(String role) {
        return role != null &&
                (role.equals("EMPLOYEE") || role.equals("MANAGER") || role.equals("ADMIN"));
    }
}
