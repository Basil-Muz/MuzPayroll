package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import java.util.List;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.EntityRightsGrpLogPK;
import com.example.MuzPayroll.entity.UserGrpLogPK;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class EntityRightsGrpMstDTO {
     @JsonIgnore
    private Authorization authorization;

    private List<EntityRightsGrpLogDTO> entityRightsGrpLogDTOs;

    private Long ErmEntityRightsGroupID;

    @JsonIgnore
    private EntityRightsGrpLogPK entityRightsGrpLogPK;

    private String ErmCode;

    private String ErmName;

    private String ErmShortName;

    private String ErmDesc;

    private Boolean ErmActiveYN;

    // private EntityMst entityMst;

    // private Long entityMstID;

    private Long ErmAuthInfoID;

    private String userCode;

    private LocalDate activeDate;

    private LocalDate InactiveDate;

    private LocalDate authorizationDate;

    private Boolean authorizationStatus;

    private String amendNo;

    private LocalDate withaffectdate;

    private Long entityHierarchyInfoID;

    private EntityHierarchyInfo HierarchyInfoID;

    public EntityHierarchyInfo getHierarchyInfoID() {
        return HierarchyInfoID;
    }

    public void setHierarchyInfoID(EntityHierarchyInfo hierarchyInfoID) {
        HierarchyInfoID = hierarchyInfoID;
    }

    public Long getEntityHierarchyInfoID() {
        return entityHierarchyInfoID;
    }

    public void setEntityHierarchyInfoID(Long entityHierarchyInfoID) {
        this.entityHierarchyInfoID = entityHierarchyInfoID;
    }

    public Long getErmEntityRightsGroupID() {
        return ErmEntityRightsGroupID;
    }

    public void setErmEntityRightsGroupID(Long ErmEntityRightsGroupID) {
        this.ErmEntityRightsGroupID = ErmEntityRightsGroupID;
    }

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

    public Boolean getErmActiveYN() {
        return ErmActiveYN;
    }

    public void setErmActiveYN(Boolean ErmActiveYN) {
        this.ErmActiveYN = ErmActiveYN;
    }

    public Long getErmAuthInfoID() {
        return ErmAuthInfoID;
    }

    public void setErmAuthInfoID(Long ErmAuthInfoID) {
        this.ErmAuthInfoID = ErmAuthInfoID;
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

    // public EntityMst getEntityMst() {
    //     return entityMst;
    // }

    // public void setEntityMst(EntityMst entityMst) {
    //     this.entityMst = entityMst;
    // }

    public List<EntityRightsGrpLogDTO> getEntityRightsGrpLogDTOs() {
        return entityRightsGrpLogDTOs;
    }

    public void setEntityRightsGrpLogDTOs(List<EntityRightsGrpLogDTO> entityRightsGrpLogDTOs) {
        this.entityRightsGrpLogDTOs = entityRightsGrpLogDTOs;
    }

    public EntityRightsGrpLogPK getEntityRightsGrpLogPK() {
        return entityRightsGrpLogPK;
    }

    public void setEntityRightsGrpLogPK(EntityRightsGrpLogPK entityRightsGrpLogPK) {
        this.entityRightsGrpLogPK = entityRightsGrpLogPK;
    }

}
