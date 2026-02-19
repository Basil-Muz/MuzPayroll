package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Transient;

@Entity
public class EntityLog {


    @EmbeddedId
    private EntityLogPK entityLogPK;

    @ManyToOne
    @MapsId("addressInfoLogPK")
    @JoinColumns({
            @JoinColumn(name = "AddressInfoID", referencedColumnName = "AddressInfoID"),
            @JoinColumn(name = "row_no", referencedColumnName = "row_no")
    })
    private AddressInfoLog addressInfoLog;

    @Column(nullable = false)
    private String EtmCode;

    @Column(nullable = false)
    private String EtmName;

    @Column(nullable = false)
    private String EtmShortName;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "EtmEntityTypeMccID", nullable = true)
    private MuzControlCodes muzControlCodes;

    @Column(nullable = true)
    private String EtmImage;

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

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(name = "InActiveDate", nullable = true)
    private LocalDate InactiveDate;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "AuthID", nullable = false)
    private Authorization authorization;

    @Column(nullable = false, name = "AmendNo")
    private String amendNo;

    // =========================
    // Getters and Setters
    // =========================
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

    public AddressInfoLog getAddressInfoLog() {
        return addressInfoLog;
    }

    public void setAddressInfoLog(AddressInfoLog addressInfoLog) {
        this.addressInfoLog = addressInfoLog;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

}
