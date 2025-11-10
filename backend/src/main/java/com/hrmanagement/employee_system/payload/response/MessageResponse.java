package com.hrmanagement.employee_system.payload.response;

// A simple class to send back a generic success/error message
public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    // --- Getter and Setter ---
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}