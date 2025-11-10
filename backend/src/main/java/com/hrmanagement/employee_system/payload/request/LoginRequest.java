package com.hrmanagement.employee_system.payload.request;

// This class models the JSON we expect for a user login
public class LoginRequest {
    private String username;
    private String password;

    // --- Getters and Setters ---
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}