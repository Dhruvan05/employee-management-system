package com.hrmanagement.employee_system.repository;

import com.hrmanagement.employee_system.model.ERole;
import com.hrmanagement.employee_system.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    // Find a role by its name (e.g., "ROLE_ADMIN")
    Optional<Role> findByName(ERole name);
}