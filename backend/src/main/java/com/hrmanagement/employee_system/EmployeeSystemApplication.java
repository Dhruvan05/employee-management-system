package com.hrmanagement.employee_system;

// Make sure to add these imports
import com.hrmanagement.employee_system.model.ERole;
import com.hrmanagement.employee_system.model.Role;
import com.hrmanagement.employee_system.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
// --- End Imports ---

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
@SpringBootApplication(scanBasePackages = "com.hrmanagement.employee_system")

public class EmployeeSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeSystemApplication.class, args);
	}

	// --- ADD THIS BEAN ---
	// This runs on startup and adds the roles to the database
	@Bean
	CommandLineRunner run(RoleRepository roleRepository) {
		return args -> {
			if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_ADMIN));
			}
			if (roleRepository.findByName(ERole.ROLE_EMPLOYEE).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_EMPLOYEE));
			}
			if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_USER));
			}
		};
	}
	// --- END BEAN ---
}