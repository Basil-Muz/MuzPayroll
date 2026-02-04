package com.example.MuzPayroll.entity.DTO;

public class ForgotPasswordVerifyRequest {

    private String userCode;
    private String otp;

    // ===== INTERNAL FLAG =====
    private boolean verified;

      public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
