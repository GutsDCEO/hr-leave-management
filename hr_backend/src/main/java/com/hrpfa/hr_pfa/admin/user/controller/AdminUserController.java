package com.hrpfa.hr_pfa.admin.user.controller;

import com.hrpfa.hr_pfa.admin.user.dto.UserListItemDTO;
import com.hrpfa.hr_pfa.admin.user.service.AdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public Page<UserListItemDTO> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String role,
            Pageable pageable) {
        return adminUserService.listUsers(q, role, pageable);
    }
}
