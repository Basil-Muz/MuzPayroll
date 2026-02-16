package com.example.MuzPayroll.entity.DTO;

import java.util.List;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.LocationMst;

public class LoginResponseDTO {

    private boolean success;
    private String message;

    // =========================
    // User Info
    // =========================
    private Long userMstId;
    private String userCode;
    private String userName;

    // =========================
    // Entity Hierarchy IDs
    // =========================
    private Long userEntityHierarchyId;        // From UserMst
    private Long defaultEntityHierarchyId;     // From UserMst
    private Long branchEntityHierarchyId;      // From entity_hierarchy_info

    // =========================
    // JWT token
    // =========================
    private String token;

    // =========================
    // Login attempt info
    // =========================
    private Integer attemptCount;
    private Integer maxAttempts;
    private Boolean accountLocked;

    // =========================
    // Getters and Setters
    // =========================

    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

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

    public Long getUserEntityHierarchyId() {
        return userEntityHierarchyId;
    }
    public void setUserEntityHierarchyId(Long userEntityHierarchyId) {
        this.userEntityHierarchyId = userEntityHierarchyId;
    }

    public Long getDefaultEntityHierarchyId() {
        return defaultEntityHierarchyId;
    }
    public void setDefaultEntityHierarchyId(Long defaultEntityHierarchyId) {
        this.defaultEntityHierarchyId = defaultEntityHierarchyId;
    }

    public Long getBranchEntityHierarchyId() {
        return branchEntityHierarchyId;
    }
    public void setBranchEntityHierarchyId(Long branchEntityHierarchyId) {
        this.branchEntityHierarchyId = branchEntityHierarchyId;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }
    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }
    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public Boolean getAccountLocked() {
        return accountLocked;
    }
    public void setAccountLocked(Boolean accountLocked) {
        this.accountLocked = accountLocked;
    }
}