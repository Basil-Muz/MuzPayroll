package com.example.MuzPayroll.entity.DTO;

import com.example.MuzPayroll.entity.UserMst;

public class ForgotPasswordRequest {

    private String userCode;
    private UserMst userEntity;
    private String message;

    public UserMst getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserMst userEntity) {
        this.userEntity = userEntity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

}
