package com.hrpfa.hr_pfa.attendance.repository;

import com.hrpfa.hr_pfa.attendance.model.Attendance;
import com.hrpfa.hr_pfa.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserAndAttendanceDate(User user, LocalDate date);
    List<Attendance> findByUserOrderByAttendanceDateDesc(User user);
}
