package com.example.MuzPayroll.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class UserGrpMst {

    @Transient
    private List<UserGrpLog> userGrpLogs;

    @Transient
    // @JsonIgnore
    private Authorization authorization;

    @Id
    @Column(name = "UgmUserGroupID", unique = true, nullable = false)
    private Long UgmUserGroupID;

    @Column(nullable = false, unique = true)
    private String UgmCode;

    @Column(nullable = false)
    private String UgmName;

    @Column(nullable = false)
    private String UgmShortName;

    @Column(nullable = false)
    private String UgmDesc;

    @Column(nullable = false)
    private Boolean UgmActiveYN;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(name = "InActiveDate", nullable = true)
    private LocalDate InactiveDate;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "UgmEntityHierarchyID", nullable = true)
    private EntityMst entityMst;

    @Column(nullable = true)
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

    public List<UserGrpLog> getUserGrpLogs() {
        return userGrpLogs;
    }

    public void setUserGrpLogs(List<UserGrpLog> userGrpLogs) {
        this.userGrpLogs = userGrpLogs;
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

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }
}
