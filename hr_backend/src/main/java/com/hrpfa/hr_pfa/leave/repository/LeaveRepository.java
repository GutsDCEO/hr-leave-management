package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import com.hrpfa.hr_pfa.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface LeaveRepository
        extends JpaRepository<LeaveRequest, Long>, JpaSpecificationExecutor<LeaveRequest>, LeaveRepositoryCustom {

    /**
     * Find all leave requests for a specific user, ordered by start date in
     * descending order
     * 
     * @param user     The user to find leave requests for
     * @param pageable Pagination information
     * @return Page of leave requests
     */
    Page<LeaveRequest> findByUserOrderByStartDateDesc(User user, Pageable pageable);

    /**
     * Find a specific leave request by ID and user
     * 
     * @param id   Leave request ID
     * @param user The user who made the request
     * @return Optional containing the leave request if found
     */
    Optional<LeaveRequest> findByIdAndUser(Long id, User user);

    /**
     * Count leave requests by status
     * 
     * @param status The status to count
     * @return Number of leave requests with the given status
     */
    Long countByStatus(com.hrpfa.hr_pfa.leave.model.LeaveStatus status);

    /**
     * Count leave requests by status and requested date range
     * 
     * @param status    The status to count
     * @param startDate Start of the date range
     * @param endDate   End of the date range
     * @return Number of leave requests with the given status in the date range
     */
    Long countByStatusAndRequestedAtBetween(com.hrpfa.hr_pfa.leave.model.LeaveStatus status,
            java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
}
