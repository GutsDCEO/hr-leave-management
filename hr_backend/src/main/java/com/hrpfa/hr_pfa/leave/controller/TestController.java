package com.hrpfa.hr_pfa.leave.controller;

import com.hrpfa.hr_pfa.leave.dto.LeaveRequestDTO;
import com.hrpfa.hr_pfa.leave.dto.LeaveResponseDTO;
import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import com.hrpfa.hr_pfa.leave.model.LeaveStatus;
import com.hrpfa.hr_pfa.leave.model.LeaveType;
import com.hrpfa.hr_pfa.leave.repository.LeaveRepository;
import com.hrpfa.hr_pfa.user.model.User;
import com.hrpfa.hr_pfa.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
public class TestController {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    @GetMapping("/db-test")
    public ResponseEntity<String> testDbConnection() {
        try {
            long count = leaveRepository.count();
            return ResponseEntity.ok("Database connection successful! Total leave requests: " + count);
        } catch (Exception e) {
            log.error("Database connection test failed", e);
            return ResponseEntity.internalServerError().body("Database connection failed: " + e.getMessage());
        }
    }

    @PostMapping("/create-test-leave")
    @Transactional
    public ResponseEntity<String> createTestLeave() {
        try {
            // Get the first user
            User user = userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No users found in the database"));

            // Create a test leave request
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setUser(user);
            leaveRequest.setStartDate(LocalDate.now().plusDays(1));
            leaveRequest.setEndDate(LocalDate.now().plusDays(3));
            leaveRequest.setType(LeaveType.ANNUAL);
            leaveRequest.setStatus(LeaveStatus.PENDING);
            leaveRequest.setReason("Test leave request");
            leaveRequest.setRequestedAt(java.time.LocalDateTime.now());
            leaveRequest.setWorkingDays(2);

            log.info("Saving test leave request: {}", leaveRequest);
            LeaveRequest saved = leaveRepository.save(leaveRequest);
            log.info("Saved leave request with ID: {}", saved.getId());

            // Verify the save
            leaveRepository.flush();
            LeaveRequest verified = leaveRepository.findById(saved.getId())
                    .orElseThrow(() -> new RuntimeException("Failed to verify save"));
            
            return ResponseEntity.ok("Test leave request created successfully with ID: " + verified.getId());
            
        } catch (Exception e) {
            log.error("Error creating test leave request", e);
            return ResponseEntity.internalServerError()
                    .body("Error creating test leave request: " + e.getMessage());
        }
    }
}
