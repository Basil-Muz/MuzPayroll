package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.UserGrpLogPK;

import jakarta.persistence.Column;

public class UserGrpLogDTO {

    private UserGrpLogPK userGrpLogPK;

    private Long UgmUserGroupID;

    private String UgmCode;

    private String UgmName;

    private String UgmShortName;

    private String UgmDesc;

    private EntityMst entityMst;

    private Long UgmAuthInfoID;

    private String amendNo;

    private Authorization authorization;

    private String userCode;

    private LocalDate authorizationDate;

    private Boolean authorizationStatus;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    private LocalDate withaffectdate;

    public String getUgmCode() {
        return UgmCode;
    }

    public void setUgmCode(String UgmCode) {
        this.UgmCode = UgmCode;
    }

    public String getUgmShortName() {
        return UgmShortName;
    }

    public void setUgmShortName(String UgmShortName) {
        this.UgmShortName = UgmShortName;
    }

    public String getUgmName() {
        return UgmName;
    }

    public void setUgmName(String UgmName) {
        this.UgmName = UgmName;
    }

    public String getUgmDesc() {
        return UgmDesc;
    }

    public void setUgmDesc(String UgmDesc) {
        this.UgmDesc = UgmDesc;
    }

    public Long getUgmAuthInfoID() {
        return UgmAuthInfoID;
    }

    public void setUgmAuthInfoID(Long UgmAuthInfoID) {
        this.UgmAuthInfoID = UgmAuthInfoID;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public Boolean getAuthorizationStatus() {
        return authorizationStatus;
    }

    public void setAuthorizationStatus(Boolean authorizationStatus) {
        this.authorizationStatus = authorizationStatus;
    }

    public LocalDate getAuthorizationDate() {
        return authorizationDate;
    }

    public void setAuthorizationDate(LocalDate authorizationDate) {
        this.authorizationDate = authorizationDate;
    }

    public UserGrpLogPK getUserGrpLogPK() {
        return userGrpLogPK;
    }

    public void setUserGrpLogPK(UserGrpLogPK userGrpLogPK) {
        this.userGrpLogPK = userGrpLogPK;
    }

    public LocalDate getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(LocalDate activeDate) {
        this.activeDate = activeDate;
    }

    public LocalDate getWithaffectdate() {
        return withaffectdate;
    }

    public void setWithaffectdate(LocalDate withaffectdate) {
        this.withaffectdate = withaffectdate;
    }

    public Long getUgmUserGroupID() {
        return UgmUserGroupID;
    }

    public void setUgmUserGroupID(Long UgmUserGroupID) {
        this.UgmUserGroupID = UgmUserGroupID;
    }

    public EntityMst getEntityMst() {
        return entityMst;
    }

    public void setEntityMst(EntityMst entityMst) {
        this.entityMst = entityMst;
    }
}
