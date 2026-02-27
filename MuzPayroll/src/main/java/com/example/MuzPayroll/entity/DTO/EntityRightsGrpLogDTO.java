package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.EntityRightsGrpLogPK;

import jakarta.persistence.Column;

public class EntityRightsGrpLogDTO {
   private EntityRightsGrpLogPK entityRightsGrpLogPK;

    private Long ErmEntityRightsGroupID;

    private String ErmCode;

    private String ErmName;

    private String ErmShortName;

    private String ErmDesc;

    // private EntityMst entityMst;

    private Long ErmAuthInfoID;

    private String amendNo;

    private Authorization authorization;

    private String userCode;

    private LocalDate authorizationDate;

    private Boolean authorizationStatus;

    private Long entityHierarchyInfoID; 

    private EntityHierarchyInfo HierarchyInfoID; 

    public EntityHierarchyInfo getHierarchyInfoID() {
        return HierarchyInfoID;
    }

    public void setHierarchyInfoID(EntityHierarchyInfo hierarchyInfoID) {
        HierarchyInfoID = hierarchyInfoID;
    }


    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

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

    public Long getErmAuthInfoID() {
        return ErmAuthInfoID;
    }

    public void setErmAuthInfoID(Long ErmAuthInfoID) {
        this.ErmAuthInfoID = ErmAuthInfoID;
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

    public EntityRightsGrpLogPK getEntityRightsGrpLogPK() {
        return entityRightsGrpLogPK;
    }

    public void setEntityRightsGrpLogPK(EntityRightsGrpLogPK entityRightsGrpLogPK) {
        this.entityRightsGrpLogPK = entityRightsGrpLogPK;
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

    public Long getErmEntityRightsGroupID() {
        return ErmEntityRightsGroupID;
    }

    public void setErmEntityRightsGroupID(Long ErmEntityRightsGroupID) {
        this.ErmEntityRightsGroupID = ErmEntityRightsGroupID;
    }

    // public EntityMst getEntityMst() {
    //     return entityMst;
    // }

    // public void setEntityMst(EntityMst entityMst) {
    //     this.entityMst = entityMst;
    // }

      public Long getEntityHierarchyInfoID() {
        return entityHierarchyInfoID;
    }


    public void setEntityHierarchyInfoID(Long entityHierarchyInfoID) {
        this.entityHierarchyInfoID = entityHierarchyInfoID;
    }
}
