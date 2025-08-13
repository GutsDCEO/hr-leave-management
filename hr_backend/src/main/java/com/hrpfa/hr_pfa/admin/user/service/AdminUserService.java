package com.hrpfa.hr_pfa.admin.user.service;

import com.hrpfa.hr_pfa.admin.user.dto.UserListItemDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    Page<UserListItemDTO> listUsers(String q, String role, Pageable pageable);
}
