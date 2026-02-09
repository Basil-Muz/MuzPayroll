package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class UserGrpLog {

    @Transient
    private Long UgmUserGroupID;

    @EmbeddedId
    private UserGrpLogPK userGrpLogPK;

    @Column(nullable = false)
    private String UgmCode;

    @Column(nullable = false)
    private String UgmName;

    @Column(nullable = false)
    private String UgmShortName;

    @Column(nullable = false)
    private String UgmDesc;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "UgmEntityHierarchyID", nullable = true)
    private EntityMst entityMst;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "UgmAuthInfoID", nullable = false)
    private Authorization authorization;

    @Column(nullable = false, name = "AmendNo")
    private String amendNo;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(nullable = false)
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

    public UserGrpLogPK getUserGrpLogPK() {
        return userGrpLogPK;
    }

    public void setUserGrpLogPK(UserGrpLogPK userGrpLogPK) {
        this.userGrpLogPK = userGrpLogPK;
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

    public EntityMst getEntityMst() {
        return entityMst;
    }

    public void setEntityMst(EntityMst entityMst) {
        this.entityMst = entityMst;
    }

    public Long getUgmUserGroupID() {
        return UgmUserGroupID;
    }

    public void setUgmUserGroupID(Long UgmUserGroupID) {
        this.UgmUserGroupID = UgmUserGroupID;
    }

}
