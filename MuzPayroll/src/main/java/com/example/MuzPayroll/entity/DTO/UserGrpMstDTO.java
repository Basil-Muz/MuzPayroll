package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import java.util.List;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.UserGrpLogPK;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserGrpMstDTO {

    @JsonIgnore
    private Authorization authorization;

    private List<UserGrpLogDTO> userGrpLogDTOs;

    private Long UgmUserGroupID;

    @JsonIgnore
    private UserGrpLogPK userGrpLogPK;

    private String UgmCode;

    private String UgmName;

    private String UgmShortName;

    private String UgmDesc;

    private Boolean UgmActiveYN;

    private EntityMst entityMst;

    private Long entityMstID;

    private Long UgmAuthInfoID;

    private String userCode;

    private LocalDate activeDate;

    private LocalDate InactiveDate;

    private LocalDate authorizationDate;

    private Boolean authorizationStatus;

    private String amendNo;

    private LocalDate withaffectdate;

    public Long getUgmUserGroupID() {
        return UgmUserGroupID;
    }

    public void setUgmUserGroupID(Long UgmUserGroupID) {
        this.UgmUserGroupID = UgmUserGroupID;
    }

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

    public Boolean getUgmActiveYN() {
        return UgmActiveYN;
    }

    public void setUgmActiveYN(Boolean UgmActiveYN) {
        this.UgmActiveYN = UgmActiveYN;
    }

    public Long getUgmAuthInfoID() {
        return UgmAuthInfoID;
    }

    public void setUgmAuthInfoID(Long UgmAuthInfoID) {
        this.UgmAuthInfoID = UgmAuthInfoID;
    }

    public LocalDate getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(LocalDate activeDate) {
        this.activeDate = activeDate;
    }

    public LocalDate getInactiveDate() {
        return InactiveDate;
    }

    public void setInactiveDate(LocalDate InactiveDate) {
        this.InactiveDate = InactiveDate;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public LocalDate getAuthorizationDate() {
        return authorizationDate;
    }

    public void setAuthorizationDate(LocalDate authorizationDate) {
        this.authorizationDate = authorizationDate;
    }

    public Boolean getAuthorizationStatus() {
        return authorizationStatus;
    }

    public void setAuthorizationStatus(Boolean authorizationStatus) {
        this.authorizationStatus = authorizationStatus;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public LocalDate getWithaffectdate() {
        return withaffectdate;
    }

    public void setWithaffectdate(LocalDate withaffectdate) {
        this.withaffectdate = withaffectdate;
    }

    public EntityMst getEntityMst() {
        return entityMst;
    }

    public void setEntityMst(EntityMst entityMst) {
        this.entityMst = entityMst;
    }

    public List<UserGrpLogDTO> getUserGrpLogDTOs() {
        return userGrpLogDTOs;
    }

    public void setUserGrpLogDTOs(List<UserGrpLogDTO> userGrpLogDTOs) {
        this.userGrpLogDTOs = userGrpLogDTOs;
    }

    public UserGrpLogPK getUserGrpLogPK() {
        return userGrpLogPK;
    }

    public void setUserGrpLogPK(UserGrpLogPK userGrpLogPK) {
        this.userGrpLogPK = userGrpLogPK;
    }

    public Long getEntityMstID() {
        return entityMstID;
    }

    public void setEntityMstID(Long entityMstID) {
        this.entityMstID = entityMstID;
    }

}
