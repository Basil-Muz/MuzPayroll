package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import java.util.List;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationLogPK;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

import jakarta.persistence.Transient;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocationDTO {
    @Transient
    private List<LocationLogDTO> locationDtoLogs;

    @Transient
    @JsonIgnore
    private Authorization authorization;

    @JsonIgnore
    private LocationLogPK locationLogPK;

    @Id
    private Long locationMstID;

    @JsonIgnore
    private CompanyMst companyEntity;

    private Long companyMstID;

    private Long branchMstID;

    @JsonIgnore
    private BranchMst branchEntity;

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

    private Long authId;

    private String amendNo;

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

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public Long getAuthId() {
        return authId;
    }

    public void setAuthId(Long authId) {
        this.authId = authId;
    }

    public List<LocationLogDTO> getLocationDtoLogs() {
        return locationDtoLogs;
    }

    public void setLocationDtoLogs(List<LocationLogDTO> locationDtoLogs) {
        this.locationDtoLogs = locationDtoLogs;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public LocationLogPK getLocationLogPK() {
        return locationLogPK;
    }

    public void setLocationLogPK(LocationLogPK locationLogPK) {
        this.locationLogPK = locationLogPK;
    }

    public Long getLocationMstID() {
        return locationMstID;
    }

    public void setLocationMstID(Long locationMstID) {
        this.locationMstID = locationMstID;
    }

    public CompanyMst getCompanyEntity() {
        return companyEntity;
    }

    public void setCompanyEntity(CompanyMst companyEntity) {
        this.companyEntity = companyEntity;
    }

    public BranchMst getBranchEntity() {
        return branchEntity;
    }

    public void setBranchEntity(BranchMst branchEntity) {
        this.branchEntity = branchEntity;
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

    public Long getBranchMstID() {
        return branchMstID;
    }

    public void setBranchMstID(Long branchMstID) {
        this.branchMstID = branchMstID;
    }

    public Long getCompanyMstID() {
        return companyMstID;
    }

    public void setCompanyMstID(Long companyMstID) {
        this.companyMstID = companyMstID;
    }
}
