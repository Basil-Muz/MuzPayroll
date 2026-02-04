package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EntityMst {

    @Id
    @Column(name = "EtmEntityID", unique = true, nullable = false)
    private Long EtmEntityID;

    @Column(nullable = false)
    private String EtmCode;

    @Column(nullable = false)
    private String EtmName;

    @Column(nullable = false)
    private String EtmShortName;

    @ManyToOne
    @JoinColumn(name = "EtmEntityTypeMccID", nullable = true)
    private MuzControlCodes muzControlCodes;

    @Column(nullable = true)
    private String EtmImage;

    @ManyToOne
    @JoinColumn(name = "EtmCompanyInfoID", nullable = true)
    private CompanyMst companyMst;

    @ManyToOne
    @JoinColumn(name = "EtmBranchInfoID", nullable = true)
    private BranchMst branchMst;

    @ManyToOne
    @JoinColumn(name = "EtmLocationInfoID", nullable = true)
    private LocationMst locationMst;

    @Column(nullable = true)
    private String EtmDocInfoID;

    @Column(nullable = true)
    private String EtmPrefix;

    @Column(nullable = true)
    private Long EtmIntPrefix;

    @Column(nullable = false)
    private Boolean EtmActiveYN;

    @Column(nullable = true)
    private Long EtmAuthInfoID;

    @Column(nullable = false)
    private Boolean EtmTransValidYN;

    // =========================
    // Getters and Setters
    // =========================

    public Long getEtmEntityID() {
        return EtmEntityID;
    }

    public void setEtmEntityID(Long etmEntityID) {
        EtmEntityID = etmEntityID;
    }

    public String getEtmCode() {
        return EtmCode;
    }

    public void setEtmCode(String etmCode) {
        EtmCode = etmCode;
    }

    public String getEtmName() {
        return EtmName;
    }

    public void setEtmName(String etmName) {
        EtmName = etmName;
    }

    public String getEtmShortName() {
        return EtmShortName;
    }

    public void setEtmShortName(String etmShortName) {
        EtmShortName = etmShortName;
    }

    public MuzControlCodes getMuzControlCodes() {
        return muzControlCodes;
    }

    public void setMuzControlCodes(MuzControlCodes muzControlCodes) {
        this.muzControlCodes = muzControlCodes;
    }

    public String getEtmImage() {
        return EtmImage;
    }

    public void setEtmImage(String etmImage) {
        EtmImage = etmImage;
    }

    public CompanyMst getCompanyMst() {
        return companyMst;
    }

    public void setCompanyMst(CompanyMst companyMst) {
        this.companyMst = companyMst;
    }

    public BranchMst getBranchMst() {
        return branchMst;
    }

    public void setBranchMst(BranchMst branchMst) {
        this.branchMst = branchMst;
    }

    public LocationMst getLocationMst() {
        return locationMst;
    }

    public void setLocationMst(LocationMst locationMst) {
        this.locationMst = locationMst;
    }

    public String getEtmDocInfoID() {
        return EtmDocInfoID;
    }

    public void setEtmDocInfoID(String etmDocInfoID) {
        EtmDocInfoID = etmDocInfoID;
    }

    public String getEtmPrefix() {
        return EtmPrefix;
    }

    public void setEtmPrefix(String etmPrefix) {
        EtmPrefix = etmPrefix;
    }

    public Long getEtmIntPrefix() {
        return EtmIntPrefix;
    }

    public void setEtmIntPrefix(Long etmIntPrefix) {
        EtmIntPrefix = etmIntPrefix;
    }

    public Boolean getEtmActiveYN() {
        return EtmActiveYN;
    }

    public void setEtmActiveYN(Boolean etmActiveYN) {
        EtmActiveYN = etmActiveYN;
    }

    public Long getEtmAuthInfoID() {
        return EtmAuthInfoID;
    }

    public void setEtmAuthInfoID(Long etmAuthInfoID) {
        EtmAuthInfoID = etmAuthInfoID;
    }

    public Boolean getEtmTransValidYN() {
        return EtmTransValidYN;
    }

    public void setEtmTransValidYN(Boolean etmTransValidYN) {
        EtmTransValidYN = etmTransValidYN;
    }
}
