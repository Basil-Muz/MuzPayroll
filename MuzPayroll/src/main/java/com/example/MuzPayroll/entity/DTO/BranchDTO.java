package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import java.util.List;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchLogPK;
import com.example.MuzPayroll.entity.CompanyMst;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

public class BranchDTO {

    @Transient
    private List<BranchLogDTO> branchDtoLogs;

    public List<BranchLogDTO> getBranchDtoLogs() {
        return branchDtoLogs;
    }

    public void setBranchDtoLogs(List<BranchLogDTO> branchDtoLogs) {
        this.branchDtoLogs = branchDtoLogs;
    }

    @Transient
    @JsonIgnore
    private Authorization authorization;

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    @JsonIgnore
    private BranchLogPK branchLogPK;

    public BranchLogPK getBranchLogPK() {
        return branchLogPK;
    }

    public void setBranchLogPK(BranchLogPK branchLogPK) {
        this.branchLogPK = branchLogPK;
    }

    @Id
    @Column(name = "BranchMstID", unique = true, nullable = false)
    private Long branchMstID;

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

    private Long authId;

    private LocalDate InactiveDate;

    private Boolean activeStatusYN;
    // Getters and setters

    public Boolean getActiveStatusYN() {
        return activeStatusYN;
    }

    public void setActiveStatusYN(Boolean activeStatusYN) {
        this.activeStatusYN = activeStatusYN;
    }

    public LocalDate getInactiveDate() {
        return InactiveDate;
    }

    public void setInactiveDate(LocalDate inactiveDate) {
        InactiveDate = inactiveDate;
    }

    public Long getAuthId() {
        return authId;
    }

    public void setAuthId(Long authId) {
        this.authId = authId;
    }

    @Column(name = "AmendNo")
    private String amendNo;

    // Getters and setters

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public Long getBranchMstID() {
        return branchMstID;
    }

    public void setBranchMstID(Long branchMstID) {
        this.branchMstID = branchMstID;
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
