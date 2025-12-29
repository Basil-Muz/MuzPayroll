package com.example.MuzPayroll.DTO;

public class ForgotPasswordResponse {

    private boolean success;
    private String message;

    // ✅ REQUIRED: no-args constructor
    public ForgotPasswordResponse() {
    }

    // optional
    public ForgotPasswordResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // ✅ REQUIRED setters
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
