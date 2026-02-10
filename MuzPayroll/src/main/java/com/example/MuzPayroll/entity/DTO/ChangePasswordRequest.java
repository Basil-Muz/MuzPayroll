package com.example.MuzPayroll.entity.DTO;

import com.example.MuzPayroll.entity.UserMst;

public class ChangePasswordRequest {

    private String userCode;
    private String currentPassword;
    private String newPassword;
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

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

}
