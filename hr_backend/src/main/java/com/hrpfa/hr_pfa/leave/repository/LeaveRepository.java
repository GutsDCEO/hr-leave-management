package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import com.hrpfa.hr_pfa.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long>, JpaSpecificationExecutor<LeaveRequest>, LeaveRepositoryCustom {
    
    /**
     * Find all leave requests for a specific user, ordered by start date in descending order
     * @param user The user to find leave requests for
     * @param pageable Pagination information
     * @return Page of leave requests
     */
    Page<LeaveRequest> findByUserOrderByStartDateDesc(User user, Pageable pageable);
    
    /**
     * Find a specific leave request by ID and user
     * @param id Leave request ID
     * @param user The user who made the request
     * @return Optional containing the leave request if found
     */
    Optional<LeaveRequest> findByIdAndUser(Long id, User user);
}
