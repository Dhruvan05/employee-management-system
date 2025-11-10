package com.hrmanagement.employee_system.repository;

import com.hrmanagement.employee_system.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // You can add custom queries here later, e.g., findByEmail(String email)
}