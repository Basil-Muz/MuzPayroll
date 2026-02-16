package com.example.MuzPayroll.entity.DTO;

public class LoginRequestDTO {
    private String userCode;
    private String password;

    // ===========================
    // Getters and Setters
    // ===========================
    public String getUserCode() {
        return userCode;
    }
    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
