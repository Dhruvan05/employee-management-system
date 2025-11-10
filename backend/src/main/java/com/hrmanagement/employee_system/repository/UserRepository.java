package com.hrmanagement.employee_system.repository;

import com.hrmanagement.employee_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find a user by their username
    Optional<User> findByUsername(String username);

    // Check if a username already exists
    Boolean existsByUsername(String username);

    // Check if an email already exists
    Boolean existsByEmail(String email);
}