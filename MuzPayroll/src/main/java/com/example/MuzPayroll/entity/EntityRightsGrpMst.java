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
public class EntityRightsGrpMst {
    @Transient
    private List<EntityRightsGrpLog> entityRightsGrpLogs;

    @Transient
    // @JsonIgnore
    private Authorization authorization;

    @Id
    @Column(name = "ErmEntityGroupID", unique = true, nullable = false)
    private Long ErmEntityGroupID;

    @Column(nullable = false)
    private String ErmCode;

    @Column(nullable = false)
    private String ErmName;

    @Column(nullable = false)
    private String ErmShortName;

    @Column(nullable = false)
    private String ErmDesc;

    @Column(nullable = false)
    private Boolean ErmActiveYN;

    @Column(name = "ErmActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(name = "ErmInActiveDate", nullable = true)
    private LocalDate InactiveDate;

    public Long getErmEntityGroupID() {
        return ErmEntityGroupID;
    }
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ErmEntityHierarchyID", nullable = true)
    private EntityMst entityMst;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ErmEntityHierarchyInfoID", nullable = true)
    private EntityHierarchyInfo entityHierarchyInfoID;

    public EntityHierarchyInfo getEntityHierarchyInfoID() {
        return entityHierarchyInfoID;
    }

    public void setEntityHierarchyInfoID(EntityHierarchyInfo entityHierarchyInfoID) {
        this.entityHierarchyInfoID = entityHierarchyInfoID;
    }
    @Column(nullable = true)
    private LocalDate withaffectdate;

    public void setErmEntityGroupID(Long ErmEntityGroupID) {
        this.ErmEntityGroupID = ErmEntityGroupID;
    }

    public String getErmCode() {
        return ErmCode;
    }

    public void setErmCode(String ErmCode) {
        this.ErmCode = ErmCode;
    }

    public String getErmName() {
        return ErmName;
    }

    public void setErmName(String ErmName) {
        this.ErmName = ErmName;
    }

    public String getErmShortName() {
        return ErmShortName;
    }

    public void setErmShortName(String ErmShortName) {
        this.ErmShortName = ErmShortName;
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
