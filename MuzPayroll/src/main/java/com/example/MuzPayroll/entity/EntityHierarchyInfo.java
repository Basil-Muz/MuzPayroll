package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EntityHierarchyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long InfoID;

    @ManyToOne
    @JoinColumn(name = "EhiEntityHierarchyID", nullable = true)
    private EntityMst entityMst;

    public EntityMst getEntityMst() {
        return entityMst;
    }

    public void setEntityMst(EntityMst entityMst) {
        this.entityMst = entityMst;
    }

    @Column(nullable = false)
    private Long EhiBusinessGroupID;

    public Long getEhiBusinessGroupID() {
        return EhiBusinessGroupID;
    }

    public void setEhiBusinessGroupID(Long ehiBusinessGroupID) {
        EhiBusinessGroupID = ehiBusinessGroupID;
    }

    @Column(nullable = true)
    private Long EhiParentLedgerID;

    public Long getEhiParentLedgerID() {
        return EhiParentLedgerID;
    }

    public void setEhiParentLedgerID(Long ehiParentLedgerID) {
        EhiParentLedgerID = ehiParentLedgerID;
    }

    @Column(nullable = true)
    private Long EhiSubLedgerID;

    public Long getEhiSubLedgerID() {
        return EhiSubLedgerID;
    }

    public void setEhiSubLedgerID(Long ehiSubLedgerID) {
        EhiSubLedgerID = ehiSubLedgerID;
    }

    @ManyToOne
    @JoinColumn(name = "EhiCompanyID", nullable = true)
    private EntityMst companyMst;

    @ManyToOne
    @JoinColumn(name = "EhiBranchID", nullable = true)
    private EntityMst branchMst;

    public EntityMst getBranchMst() {
        return branchMst;
    }

    public void setBranchMst(EntityMst branchMst) {
        this.branchMst = branchMst;
    }

    @ManyToOne
    @JoinColumn(name = "EhiLocationID", nullable = true)
    private EntityMst locationMst;

    public EntityMst getLocationMst() {
        return locationMst;
    }

    public void setLocationMst(EntityMst locationMst) {
        this.locationMst = locationMst;
    }

    @Column(nullable = false)
    private Long EhiLevelNo;

    public Long getEhiLevelNo() {
        return EhiLevelNo;
    }

    public void setEhiLevelNo(Long ehiLevelNo) {
        EhiLevelNo = ehiLevelNo;
    }

    @Column(nullable = true)
    private Long EhiParentEntityHierarchyID;

    public Long getEhiParentEntityHierarchyID() {
        return EhiParentEntityHierarchyID;
    }

    public void setEhiParentEntityHierarchyID(Long ehiParentEntityHierarchyID) {
        EhiParentEntityHierarchyID = ehiParentEntityHierarchyID;
    }

    @ManyToOne
    @JoinColumn(name = "EhiLeafEntityTypeMccID", nullable = true)
    private MuzControlCodes muzControlCodes;

    public MuzControlCodes getMuzControlCodes() {
        return muzControlCodes;
    }

    public void setMuzControlCodes(MuzControlCodes muzControlCodes) {
        this.muzControlCodes = muzControlCodes;
    }

    public EntityMst getCompanyMst() {
        return companyMst;
    }

    public void setCompanyMst(EntityMst companyMst) {
        this.companyMst = companyMst;
    }

    public Long getInfoID() {
        return InfoID;
    }

    public void setInfoID(Long InfoID) {
        this.InfoID = InfoID;
    }

}
