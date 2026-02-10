package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserMst {

    @Id
    @Column(name = "UserMstID", unique = true, nullable = false)
    private Long userMstID;

    @Column(nullable = false, unique = true)
    private String userCode;

    @Column(nullable = false, length = 100)
    private String userName;

    @Column(nullable = false, length = 255)
    private String password;

    @ManyToOne
    @JoinColumn(name = "UsmEntityHierarchyID", nullable = false)
    private EntityHierarchyInfo entityHierarchyInfo;

    @ManyToOne
    @JoinColumn(name = "UsmUserTypeID", nullable = false)
    private UserTypeMst userTypeMst;

    @Column(nullable = true)
    private LocalDate UsmPasswordLastChangedDate;

    @Column(nullable = false)
    private Boolean UsmChangePasswordOnNextLogin;

    @Column(nullable = false)
    private Long UsmDefaultEntityHierarchyID;

    @Column(nullable = false)
    private Boolean UsmActiveYN;

    @Column(nullable = false)
    private Long UsmAuthInfoID;

    @Column(nullable = false)
    private Boolean UsmTransValidYN;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String phoneNumber;

    @Column(nullable = false)
    private Integer userAttempt = 0;

    @ManyToOne
    @JoinColumn(name = "CompanyID", nullable = false)
    private CompanyMst companyEntity;

    @ManyToOne
    @JoinColumn(name = "BranchID", nullable = false)
    private BranchMst branchEntity;

    @ManyToOne
    @JoinColumn(name = "LocationID", nullable = false)
    private LocationMst locationEntity;

    public Long getUserMstID() {
        return userMstID;
    }

    public void setUserMstID(Long userMstID) {
        this.userMstID = userMstID;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getUserAttempt() {
        return userAttempt;
    }

    public void setUserAttempt(Integer userAttempt) {
        this.userAttempt = userAttempt;
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

    public LocationMst getLocationEntity() {
        return locationEntity;
    }

    public void setLocationEntity(LocationMst locationEntity) {
        this.locationEntity = locationEntity;
    }

    public EntityHierarchyInfo getEntityHierarchyInfo() {
        return entityHierarchyInfo;
    }

    public void setEntityHierarchyInfo(EntityHierarchyInfo entityHierarchyInfo) {
        this.entityHierarchyInfo = entityHierarchyInfo;
    }

    public UserTypeMst getUserTypeMst() {
        return userTypeMst;
    }

    public void setUserTypeMst(UserTypeMst userTypeMst) {
        this.userTypeMst = userTypeMst;
    }

    public LocalDate getUsmPasswordLastChangedDate() {
        return UsmPasswordLastChangedDate;
    }

    public void setUsmPasswordLastChangedDate(LocalDate UsmPasswordLastChangedDate) {
        this.UsmPasswordLastChangedDate = UsmPasswordLastChangedDate;
    }

    public Boolean getUsmChangePasswordOnNextLogin() {
        return UsmChangePasswordOnNextLogin;
    }

    public void setUsmChangePasswordOnNextLogin(Boolean UsmChangePasswordOnNextLogin) {
        this.UsmChangePasswordOnNextLogin = UsmChangePasswordOnNextLogin;
    }

    public Long getUsmDefaultEntityHierarchyID() {
        return UsmDefaultEntityHierarchyID;
    }

    public void setUsmDefaultEntityHierarchyID(Long UsmDefaultEntityHierarchyID) {
        this.UsmDefaultEntityHierarchyID = UsmDefaultEntityHierarchyID;
    }

    public Boolean getUsmActiveYN() {
        return UsmActiveYN;
    }

    public void setUsmActiveYN(Boolean UsmActiveYN) {
        this.UsmActiveYN = UsmActiveYN;
    }

    public Long getUsmAuthInfoID() {
        return UsmAuthInfoID;
    }

    public void setUsmAuthInfoID(Long UsmAuthInfoID) {
        this.UsmAuthInfoID = UsmAuthInfoID;
    }

    public Boolean getUsmTransValidYN() {
        return UsmTransValidYN;
    }

    public void setUsmTransValidYN(Boolean UsmTransValidYN) {
        this.UsmTransValidYN = UsmTransValidYN;
    }

}
