package com.example.MuzPayroll.entity.DTO;

// import com.example.MuzPayroll.entity.UserMst;

public class ForgotPasswordOtpRequest {

    private String userCode;
    private String email;
    private String generatedOtp;

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getGeneratedOtp() {
        return generatedOtp;
    }

    public void setGeneratedOtp(String generatedOtp) {
        this.generatedOtp = generatedOtp;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
