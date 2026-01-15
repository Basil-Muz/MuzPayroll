package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationLogPK;

import jakarta.persistence.Column;

public class LocationLogDTO {
    private LocationLogPK locatioinLogPK;

    private Authorization authorization;

    private CompanyMst companyEntity;

    private BranchMst branchEntity;

    public BranchMst getBranchEntity() {
        return branchEntity;
    }

    public void setBranchEntity(BranchMst branchEntity) {
        this.branchEntity = branchEntity;
    }

    public CompanyMst getCompanyEntity() {
        return companyEntity;
    }

    public void setCompanyEntity(CompanyMst companyEntity) {
        this.companyEntity = companyEntity;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public LocationLogPK getLocatioinLogPK() {
        return locatioinLogPK;
    }

    public void setLocatioinLogPK(LocationLogPK locatioinLogPK) {
        this.locatioinLogPK = locatioinLogPK;
    }

    private String code;

    private String location;

    private String shortName;

    private LocalDate activeDate;

    private String esiRegion;

    private String address;

    private String address1;
    private String address2;

    private String country;

    private String state;

    private String district;

    private String place;

    private String pincode;

    private String landlineNumber;

    private String mobileNumber;

    private String email;

    private String employerName;

    private String designation;

    private String employerNumber;

    private String employerEmail;

    private LocalDate withaffectdate;

    private String amendNo;

    private Long locationMstID;

    // Getters and setters

    public Long getLocationMstID() {
        return locationMstID;
    }

    public void setLocationMstID(Long locationMstID) {
        this.locationMstID = locationMstID;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public LocalDate getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(LocalDate activeDate) {
        this.activeDate = activeDate;
    }

    public String getEsiRegion() {
        return esiRegion;
    }

    public void setEsiRegion(String esiRegion) {
        this.esiRegion = esiRegion;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getLandlineNumber() {
        return landlineNumber;
    }

    public void setLandlineNumber(String landlineNumber) {
        this.landlineNumber = landlineNumber;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getEmployerNumber() {
        return employerNumber;
    }

    public void setEmployerNumber(String employerNumber) {
        this.employerNumber = employerNumber;
    }

    public String getEmployerEmail() {
        return employerEmail;
    }

    public void setEmployerEmail(String employerEmail) {
        this.employerEmail = employerEmail;
    }

    public LocalDate getWithaffectdate() {
        return withaffectdate;
    }

    public void setWithaffectdate(LocalDate withaffectdate) {
        this.withaffectdate = withaffectdate;
    }

    // Authorization

    private Long authId;

    public Long getAuthId() {
        return authId;
    }

    public void setAuthId(Long authId) {
        this.authId = authId;
    }

    @Column
    private Long mstId;

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

    public Long getMstId() {
        return mstId;
    }

    public void setMstId(Long mstId) {
        this.mstId = mstId;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

}
