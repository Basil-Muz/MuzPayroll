package com.example.MuzPayroll.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class EntityMst {

    @Transient
    private List<EntityLog> entityLogs;

    @Transient
    private EntityLogPK entityLogPK;

    @Transient
    @JsonIgnore
    private Authorization authorization;

    @Transient
    @JsonIgnore
    private AddressInfoMst addressInfoMst;

    @Transient
    private String amendNo;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EtmEntityID")
    private Long etmEntityId;

    @Column(name = "EtmCode", nullable = false)
    private String etmCode;

    @Column(name = "EtmName", nullable = false)
    private String etmName;

    @Column(nullable = false)
    private String EtmShortName;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "EtmEntityTypeMccID", nullable = true)
    private MuzControlCodes muzControlCodes;

    @Column(nullable = true)
    private String EtmImage;

    @ManyToOne
    @JoinColumn(name = "AddressInfoID", nullable = true)
    private AddressInfoMst addressInfoID;

    @Column(nullable = true)
    private String EtmDocInfoID;

    @Column(nullable = true)
    private String EtmPrefix;

    @Column(nullable = true)
    private Long EtmIntPrefix;

    @Column(nullable = false)
    private Boolean EtmActiveYN;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(name = "InActiveDate", nullable = true)
    private LocalDate InactiveDate;

    // =========================
    // Getters and Setters
    // =========================

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

    public AddressInfoMst getAddressInfoID() {
        return addressInfoID;
    }

    public void setAddressInfoID(AddressInfoMst addressInfoID) {
        this.addressInfoID = addressInfoID;
    }

    public Long getEtmEntityId() {
        return etmEntityId;
    }

    public void setEtmEntityId(Long etmEntityId) {
        this.etmEntityId = etmEntityId;
    }

    public String getEtmCode() {
        return etmCode;
    }

    public void setEtmCode(String etmCode) {
        this.etmCode = etmCode;
    }

    public String getEtmName() {
        return etmName;
    }

    public void setEtmName(String etmName) {
        this.etmName = etmName;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public EntityLogPK getEntityLogPK() {
        return entityLogPK;
    }

    public void setEntityLogPK(EntityLogPK entityLogPK) {
        this.entityLogPK = entityLogPK;
    }

    public List<EntityLog> getEntityLogs() {
        return entityLogs;
    }

    public void setEntityLogs(List<EntityLog> entityLogs) {
        this.entityLogs = entityLogs;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public AddressInfoMst getAddressInfoMst() {
        return addressInfoMst;
    }

    public void setAddressInfoMst(AddressInfoMst addressInfoMst) {
        this.addressInfoMst = addressInfoMst;
    }
}
