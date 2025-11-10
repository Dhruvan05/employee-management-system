package com.hrmanagement.employee_system.repository;

import com.hrmanagement.employee_system.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Spring Data JPA automatically creates a query:
    // "find a department by its name"
    Department findByName(String name);
}