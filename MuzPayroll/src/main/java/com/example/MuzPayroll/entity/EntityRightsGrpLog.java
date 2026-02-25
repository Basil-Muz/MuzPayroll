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
public class EntityRightsGrpLog {

    @Transient
    private Long ErmEntityRightsGroupID;

    @EmbeddedId
    private EntityRightsGrpLogPK entityRightsGrpLogPK;

    @Column(nullable = false)
    private String ErmCode;

    @Column(nullable = false)
    private String ErmName;

    @Column(nullable = false)
    private String ErmShortName;

    @Column(nullable = false)
    private String ErmDesc;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ErmEntityHierarchyID", nullable = true)
    private EntityMst entityMst;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ErmAuthInfoID", nullable = false)
    private Authorization authorization;

    @Column(nullable = false, name = "AmendNo")
    private String amendNo;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(nullable = false)
    private LocalDate withaffectdate;

    public String getErmCode() {
        return ErmCode;
    }

    public void setErmCode(String ErmCode) {
        this.ErmCode = ErmCode;
    }

    public String getErmShortName() {
        return ErmShortName;
    }

    public void setErmShortName(String ErmShortName) {
        this.ErmShortName = ErmShortName;
    }

    public String getErmName() {
        return ErmName;
    }

    public void setErmName(String ErmName) {
        this.ErmName = ErmName;
    }

    public String getErmDesc() {
        return ErmDesc;
    }

    public void setErmDesc(String ErmDesc) {
        this.ErmDesc = ErmDesc;
    }

    public EntityRightsGrpLogPK getEntityRightsGrpLogPK() {
        return entityRightsGrpLogPK;
    }

    public void setEntityRightsGrpLogPK(EntityRightsGrpLogPK entityRightsGrpLogPK) {
        this.entityRightsGrpLogPK = entityRightsGrpLogPK;
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

    public Long getErmEntityRightsGroupID() {
        return ErmEntityRightsGroupID;
    }

    public void setErmEntityRightsGroupID(Long ErmEntityRightsGroupID) {
        this.ErmEntityRightsGroupID = ErmEntityRightsGroupID;
    }


}

