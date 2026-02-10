package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EntityRightsGrpMst {

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

    @ManyToOne
    @JoinColumn(name = "ErmEntityHierarchyID", nullable = true)
    private EntityHierarchyInfo entityHierarchyInfo;

    @Column(name = "ErmActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(name = "ErmInActiveDate", nullable = true)
    private LocalDate InactiveDate;

    public Long getErmEntityGroupID() {
        return ErmEntityGroupID;
    }

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

    public EntityHierarchyInfo getEntityHierarchyInfo() {
        return entityHierarchyInfo;
    }

    public void setEntityHierarchyInfo(EntityHierarchyInfo entityHierarchyInfo) {
        this.entityHierarchyInfo = entityHierarchyInfo;
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
}
