package com.hrpfa.hr_pfa.admin.user.service;

import com.hrpfa.hr_pfa.admin.user.dto.UserListItemDTO;
import com.hrpfa.hr_pfa.admin.user.spec.UserSpecifications;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    @Autowired
    public AdminUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Page<UserListItemDTO> listUsers(String q, String role, Pageable pageable) {
        Specification<User> spec = Specification.where(UserSpecifications.matchesQuery(q))
                .and(UserSpecifications.hasRole(role));
        return userRepository.findAll(spec, pageable)
                .map(this::toListItemDTO);
    }

    private UserListItemDTO toListItemDTO(User user) {
        return UserListItemDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
