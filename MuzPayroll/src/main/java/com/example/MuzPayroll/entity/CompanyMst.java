package com.example.MuzPayroll.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompanyMst {

    @Transient
    private List<CompanyLog> CompanyLogs;

    @Transient
    private CompanyLogPK companyLogPK;

    @Transient
    @JsonIgnore
    private Authorization authorization;

    @Id
    @Column(name = "CompanyMstID", unique = true, nullable = false)
    private Long companyMstID;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String shortName;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

    @Column(nullable = true)
    private String companyImage;

    @Column(nullable = false)
    private String address;

    private String address1;
    private String address2;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String place;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = true)
    private String landlineNumber;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = true)
    private String employerName;

    @Column(nullable = true)
    private String designation;

    @Column(nullable = true)
    private String employerNumber;

    @Column(nullable = true)
    private String employerEmail;

    @Column(nullable = false)
    private LocalDate withaffectdate;

    @Column(name = "InActiveDate", nullable = true)
    private LocalDate InactiveDate;

    @Column(nullable = false)
    private Boolean activeStatusYN;
    // Getters and setters

    public CompanyLogPK getCompanyLogPK() {
        return companyLogPK;
    }

    public void setCompanyLogPK(CompanyLogPK companyLogPK) {
        this.companyLogPK = companyLogPK;
    }

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

    public Long getCompanyMstID() {
        return companyMstID;
    }

    public void setCompanyMstID(Long companyMstID) {
        this.companyMstID = companyMstID;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public String getCompanyImage() {
        return companyImage;
    }

    public void setCompanyImage(String companyImage) {
        this.companyImage = companyImage;
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

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public List<CompanyLog> getCompanyLogs() {
        return CompanyLogs;
    }

    public void setCompanyLogs(List<CompanyLog> companyLogs) {
        CompanyLogs = companyLogs;
    }

    @Transient
    private String amendNo;

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

}
