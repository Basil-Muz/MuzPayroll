package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class BranchLog {

    @EmbeddedId
    private BranchLogPK branchLogPK;

    @ManyToOne
    @JoinColumn(name = "AuthID", nullable = false)
    private Authorization authorization;

    @ManyToOne
    @JoinColumn(name = "CompanyID", nullable = false)
    private CompanyMst companyEntity;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private String shortName;

    @Column(name = "ActiveDate", nullable = false)
    private LocalDate activeDate;

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
    private Integer pincode;

    @Column(nullable = false)
    private Long landlineNumber;

    @Column(nullable = false)
    private Long mobileNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String employerName;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private Long employerNumber;

    @Column(nullable = false)
    private String employerEmail;

    @Column(nullable = false)
    private LocalDate withaffectdate;

    // Getters and setters
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

    public Integer getPincode() {
        return pincode;
    }

    public void setPincode(Integer pincode) {
        this.pincode = pincode;
    }

    public Long getLandlineNumber() {
        return landlineNumber;
    }

    public void setLandlineNumber(Long landlineNumber) {
        this.landlineNumber = landlineNumber;
    }

    public Long getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(Long mobileNumber) {
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

    public Long getEmployerNumber() {
        return employerNumber;
    }

    public void setEmployerNumber(Long employerNumber) {
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
}
