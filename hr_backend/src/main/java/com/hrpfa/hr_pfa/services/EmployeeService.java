package com.hrpfa.hr_pfa.services;

import com.hrpfa.hr_pfa.exceptions.UserNotFoundException;
import com.hrpfa.hr_pfa.models.Employee;
import com.hrpfa.hr_pfa.repositories.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EmployeeService {

    // NOTE :
    // This is a Dependency injection ; we Instanciate the EmployeeRepo which extends JPArepo to use the methods located in the JPArepo .
    // The final keyword ensures the repository can't be reassigned after initialization.
    private final EmployeeRepo employeeRepo;

    // NOTE :
    // @Autowire Injects the EmployeeRepo dependency through constructor injection

    @Autowired
    public EmployeeService(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public Employee addEmployee(Employee employee) {
        employee.setEmployeeCode(UUID.randomUUID().toString());
        return employeeRepo.save(employee);
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepo.findById(id).orElseThrow(() -> new UserNotFoundException("Employee with id " + id + " not found"));
    }

    public void deleteEmployeeById(Long id) {
        employeeRepo.deleteById(id);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepo.findAll();
    }

    public Employee updateEmployee(Employee employee) {
        return employeeRepo.save(employee);
    }


}
