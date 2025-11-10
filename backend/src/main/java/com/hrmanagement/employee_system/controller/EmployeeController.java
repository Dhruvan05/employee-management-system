package com.hrmanagement.employee_system.controller;

import com.hrmanagement.employee_system.model.Department;
import com.hrmanagement.employee_system.model.Employee;
import com.hrmanagement.employee_system.repository.DepartmentRepository;
import com.hrmanagement.employee_system.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')") // <-- UPDATED
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        if (employee.getDepartment() == null || employee.getDepartment().getId() == null) {
            return ResponseEntity.badRequest().body("Department ID is required.");
        }

        Department department = departmentRepository.findById(employee.getDepartment().getId())
                .orElse(null);

        if (department == null) {
            return ResponseEntity.badRequest().body("Invalid Department ID.");
        }

        employee.setDepartment(department);
        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);

        if (employee.isPresent()) {
            return ResponseEntity.ok(employee.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')") // <-- UPDATED
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);

        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Employee existingEmployee = optionalEmployee.get();

        existingEmployee.setFirstName(employeeDetails.getFirstName());
        existingEmployee.setLastName(employeeDetails.getLastName());
        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setDesignation(employeeDetails.getDesignation());
        existingEmployee.setJoiningDate(employeeDetails.getJoiningDate());

        if (employeeDetails.getDepartment() != null && employeeDetails.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(employeeDetails.getDepartment().getId())
                    .orElse(null);

            if (department == null) {
                return ResponseEntity.badRequest().body("Invalid Department ID.");
            }
            existingEmployee.setDepartment(department);
        }

        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')") // <-- UPDATED
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);

        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        employeeRepository.deleteById(id);

        return ResponseEntity.ok().body("Employee deleted successfully.");
    }
}