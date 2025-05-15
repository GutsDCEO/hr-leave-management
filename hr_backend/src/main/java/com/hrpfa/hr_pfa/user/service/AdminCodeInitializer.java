package com.hrpfa.hr_pfa.user.service;

import com.hrpfa.hr_pfa.user.model.AdminCode;
import com.hrpfa.hr_pfa.user.repository.AdminCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.UUID;

@Component
public class AdminCodeInitializer {
    @Autowired
    private AdminCodeRepository adminCodeRepository;

    @PostConstruct
    public void init() {
        if (!adminCodeRepository.existsById(1L)) {
            String adminCode = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
            AdminCode codeEntity = new AdminCode();
            codeEntity.setId(1L);
            codeEntity.setCode(adminCode);
            adminCodeRepository.save(codeEntity);
            // Log the code securely (remove after first use)
            System.out.println("[INFO] Admin code for registration: " + adminCode);
        }
    }
}
