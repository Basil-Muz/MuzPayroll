package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public class UserDTO {
    private Long userMstId;
    private String userCode;
    private String userName;
    private String email;
    private String password;
    private String mobileNo;
    private Long userTypeId;
    private Long authorizationStatus;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate activeDate;
    private Boolean activeYN;
    private Boolean changePasswordNextLogin;
    private Long entityHierarchyId;
    private Long defaultEntityHierarchyId;

    public Long getUserMstId() {
        return userMstId;
    }

    public void setUserMstId(Long userMstId) {
        this.userMstId = userMstId;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public Long getUserTypeId() {
        return userTypeId;
    }

    public void setUserTypeId(Long userTypeId) {
        this.userTypeId = userTypeId;
    }

    public Boolean getChangePasswordNextLogin() {
        return changePasswordNextLogin;
    }

    public void setChangePasswordNextLogin(Boolean changePasswordNextLogin) {
        this.changePasswordNextLogin = changePasswordNextLogin;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getAuthorizationStatus() {
        return authorizationStatus;
    }

    public void setAuthorizationStatus(Long authorizationStatus) {
        this.authorizationStatus = authorizationStatus;
    }

    public Boolean getActiveYN() {
        return activeYN;
    }

    public void setActiveYN(Boolean activeYN) {
        this.activeYN = activeYN;
    }

    public Long getEntityHierarchyId() {
        return entityHierarchyId;
    }

    public void setEntityHierarchyId(Long entityHierarchyId) {
        this.entityHierarchyId = entityHierarchyId;
    }

    public Long getDefaultEntityHierarchyId() {
        return defaultEntityHierarchyId;
    }

    public void setDefaultEntityHierarchyId(Long defaultEntityHierarchyId) {
        this.defaultEntityHierarchyId = defaultEntityHierarchyId;
    }

    public LocalDate getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(LocalDate activeDate) {
        this.activeDate = activeDate;
    }
}