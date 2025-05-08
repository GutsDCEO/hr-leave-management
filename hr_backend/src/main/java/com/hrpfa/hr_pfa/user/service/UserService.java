package com.hrpfa.hr_pfa.user.service;

import com.hrpfa.hr_pfa.user.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    User updateUserRole(Long userId, String newRole);
    List<User> getAllUsers();
    Optional<User> getUserByEmail(String email);
}
