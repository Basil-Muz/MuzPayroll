package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.AddressInfoMst;
import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityLogPK;
import com.example.MuzPayroll.entity.MuzControlCodes;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Transient;

public class EntityMstDTO {

    @Transient
    private Authorization authorization;

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    @Transient
    private List<EntityLogDTO> entityLogDTOs;

    private String EtmCode;

    public String getEtmCode() {
        return EtmCode;
    }

    public void setEtmCode(String etmCode) {
        EtmCode = etmCode;
    }

    private Long etmEntityId;

    private EntityLogPK entityLogPK;

    public EntityLogPK getEntityLogPK() {
        return entityLogPK;
    }

    public void setEntityLogPK(EntityLogPK entityLogPK) {
        this.entityLogPK = entityLogPK;
    }

    private String EtmName;

    public String getEtmName() {
        return EtmName;
    }

    public void setEtmName(String etmName) {
        EtmName = etmName;
    }

    private String EtmShortName;

    public String getEtmShortName() {
        return EtmShortName;
    }

    public void setEtmShortName(String etmShortName) {
        EtmShortName = etmShortName;
    }

    private Long EtmEntityTypeMccID;

    public Long getEtmEntityTypeMccID() {
        return EtmEntityTypeMccID;
    }

    public void setEtmEntityTypeMccID(Long etmEntityTypeMccID) {
        EtmEntityTypeMccID = etmEntityTypeMccID;
    }

    private MuzControlCodes muzControlCodes;

    public MuzControlCodes getMuzControlCodes() {
        return muzControlCodes;
    }

    public void setMuzControlCodes(MuzControlCodes muzControlCodes) {
        this.muzControlCodes = muzControlCodes;
    }

    private MultipartFile EtmImage;

    public MultipartFile getEtmImage() {
        return EtmImage;
    }

    public void setEtmImage(MultipartFile etmImage) {
        EtmImage = etmImage;
    }

    private String EtmDocInfoID;

    public String getEtmDocInfoID() {
        return EtmDocInfoID;
    }

    public void setEtmDocInfoID(String etmDocInfoID) {
        EtmDocInfoID = etmDocInfoID;
    }

    private String EtmPrefix;

    public String getEtmPrefix() {
        return EtmPrefix;
    }

    public void setEtmPrefix(String etmPrefix) {
        EtmPrefix = etmPrefix;
    }

    private Long EtmIntPrefix;

    public Long getEtmIntPrefix() {
        return EtmIntPrefix;
    }

    public void setEtmIntPrefix(Long etmIntPrefix) {
        EtmIntPrefix = etmIntPrefix;
    }

    private Boolean EtmActiveYN;

    public Boolean getEtmActiveYN() {
        return EtmActiveYN;
    }

    public void setEtmActiveYN(Boolean etmActiveYN) {
        EtmActiveYN = etmActiveYN;
    }

    private Long EtmAuthInfoID;

    public Long getEtmAuthInfoID() {
        return EtmAuthInfoID;
    }

    public void setEtmAuthInfoID(Long etmAuthInfoID) {
        EtmAuthInfoID = etmAuthInfoID;
    }

    private LocalDate activeDate;

    public LocalDate getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(LocalDate activeDate) {
        this.activeDate = activeDate;
    }

    private LocalDate InactiveDate;

    public LocalDate getInactiveDate() {
        return InactiveDate;
    }

    public void setInactiveDate(LocalDate inactiveDate) {
        InactiveDate = inactiveDate;
    }

    private Long LogPK;

    public Long getLogPK() {
        return LogPK;
    }

    public void setLogPK(Long logPK) {
        LogPK = logPK;
    }

    private Long MstID;

    public Long getMstID() {
        return MstID;
    }

    public void setMstID(Long mstID) {
        MstID = mstID;
    }

    private String ImagePath;

    public String getImagePath() {
        return ImagePath;
    }

    public void setImagePath(String imagePath) {
        ImagePath = imagePath;
    }

    private String address;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    private String address1;

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    private String address2;

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    private String country;

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    private String state;

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    private String district;

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    private String place;

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    private String pincode;

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    private String landlineNumber;

    public String getLandlineNumber() {
        return landlineNumber;
    }

    public void setLandlineNumber(String landlineNumber) {
        this.landlineNumber = landlineNumber;
    }

    private String mobileNumber;

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String employerName;

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    private String designation;

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    private String employerNumber;

    public String getEmployerNumber() {
        return employerNumber;
    }

    public void setEmployerNumber(String employerNumber) {
        this.employerNumber = employerNumber;
    }

    private String employerEmail;

    public String getEmployerEmail() {
        return employerEmail;
    }

    public void setEmployerEmail(String employerEmail) {
        this.employerEmail = employerEmail;
    }

    private LocalDate withaffectdate;

    public LocalDate getWithaffectdate() {
        return withaffectdate;
    }

    public void setWithaffectdate(LocalDate withaffectdate) {
        this.withaffectdate = withaffectdate;
    }

    private Long authId;

    public Long getAuthId() {
        return authId;
    }

    public void setAuthId(Long authId) {
        this.authId = authId;
    }

    private String amendNo;

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    @Transient
    @JsonIgnore
    private AddressInfoMst addressInfoMst;

    private AddressInfoMst addressInfoID;

    // Authorization

    @Column(nullable = false)
    private String userCode;

    @Column(nullable = false)
    private LocalDate authorizationDate;

    public LocalDate getAuthorizationDate() {
        return authorizationDate;
    }

    public void setAuthorizationDate(LocalDate authorizationDate) {
        this.authorizationDate = authorizationDate;
    }

    @Column(nullable = false)
    private Boolean authorizationStatus;

    public Boolean getAuthorizationStatus() {
        return authorizationStatus;
    }

    public void setAuthorizationStatus(Boolean authorizationStatus) {
        this.authorizationStatus = authorizationStatus;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public List<EntityLogDTO> getEntityLogDTOs() {
        return entityLogDTOs;
    }

    public void setEntityLogDTOs(List<EntityLogDTO> entityLogDTOs) {
        this.entityLogDTOs = entityLogDTOs;
    }

    public Long getEtmEntityId() {
        return etmEntityId;
    }

    public void setEtmEntityId(Long etmEntityId) {
        this.etmEntityId = etmEntityId;
    }

    public AddressInfoMst getAddressInfoMst() {
        return addressInfoMst;
    }

    public void setAddressInfoMst(AddressInfoMst addressInfoMst) {
        this.addressInfoMst = addressInfoMst;
    }

    public AddressInfoMst getAddressInfoID() {
        return addressInfoID;
    }

    public void setAddressInfoID(AddressInfoMst addressInfoID) {
        this.addressInfoID = addressInfoID;
    }

}
