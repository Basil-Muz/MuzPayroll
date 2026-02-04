package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchLogPK;
import com.example.MuzPayroll.entity.CompanyMst;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;

public class BranchLogDTO {
    private BranchLogPK branchLogPK;

    @JsonIgnore
    private Authorization authorization;

    @JsonIgnore
    private CompanyMst companyEntity;

    private String code;

    private String branch;

    private String shortName;

    private LocalDate activeDate;

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

    private LocalDate withaffectdate;

    private String amendNo;

    private Long branchMstID;

    private Long companyMstID;

    // Getters and setters

    public Long getCompanyMstID() {
        return companyMstID;
    }

    public void setCompanyMstID(Long companyMstID) {
        this.companyMstID = companyMstID;
    }

    public Long getBranchMstID() {
        return branchMstID;
    }

    public void setBranchMstID(Long branchMstID) {
        this.branchMstID = branchMstID;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public BranchLogPK getBranchLogPK() {
        return branchLogPK;
    }

    public void setBranchLogPK(BranchLogPK branchLogPK) {
        this.branchLogPK = branchLogPK;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public CompanyMst getCompanyEntity() {
        return companyEntity;
    }

    public void setCompanyEntity(CompanyMst companyEntity) {
        this.companyEntity = companyEntity;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
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
}
