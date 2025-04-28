package com.hrpfa.hr_pfa.repositories;

import com.hrpfa.hr_pfa.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
}
