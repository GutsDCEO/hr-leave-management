package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LeaveRepository extends JpaRepository<LeaveRequest, Long>, LeaveRepositoryCustom {


}
