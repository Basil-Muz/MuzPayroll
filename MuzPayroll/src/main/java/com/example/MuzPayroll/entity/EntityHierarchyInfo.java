package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EntityHierarchyInfo {

    @Id
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
    private CompanyMst companyMst;

    public CompanyMst getCompanyMst() {
        return companyMst;
    }

    public void setCompanyMst(CompanyMst companyMst) {
        this.companyMst = companyMst;
    }

    @ManyToOne
    @JoinColumn(name = "EhiBranchID", nullable = true)
    private BranchMst branchMst;

    public BranchMst getBranchMst() {
        return branchMst;
    }

    public void setBranchMst(BranchMst branchMst) {
        this.branchMst = branchMst;
    }

    @ManyToOne
    @JoinColumn(name = "EhiLocationID", nullable = true)
    private LocationMst locationMst;

    public LocationMst getLocationMst() {
        return locationMst;
    }

    public void setLocationMst(LocationMst locationMst) {
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

}
