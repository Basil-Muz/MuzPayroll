package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class EmployeeMst {

    // @Transient
    // private List<EntityLog> entityLogs;

    // @Transient
    // private EntityLogPK entityLogPK;

    @Transient
    private Authorization authorization;

    @Transient
    private String amendNo;

    @Id
    @Column(name = "EmpEmployeeID")
    private Long empEmployeeID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "EmpEntityHierarchyID", nullable = true)
    private EntityMst empEntityHierarchyID;

    @Column(name = "EmpCode", nullable = false)
    private String empCode;

    @Column(nullable = true)
    private Long empGenderMccID;

    @Column(nullable = false)
    private LocalDate empDOB;

    @Column(nullable = true)
    private Long empBloodGroupMccID;

    @Column(nullable = true)
    private String empPhotograph;

    @Column(nullable = true)
    private Long empAddressID;

    @Column(nullable = true)
    private Boolean empCorrespondanceYN;

    @Column(nullable = true)
    private Long empCorrespondanceAddressID;

    @Column(nullable = true)
    private Long empContactInfoID;

    @Column(nullable = true)
    private Long empDocInfoID;

    @Column(nullable = true)
    private Boolean empActiveYN;

    @Column(nullable = true)
    private Boolean empTransValidYN;

    @Column(nullable = true)
    private LocalDate empActualDOB;

    public Long getEmpEmployeeID() {
        return empEmployeeID;
    }

    public void setEmpEmployeeID(Long empEmployeeID) {
        this.empEmployeeID = empEmployeeID;
    }

    public EntityMst getEmpEntityHierarchyID() {
        return empEntityHierarchyID;
    }

    public void setEmpEntityHierarchyID(EntityMst empEntityHierarchyID) {
        this.empEntityHierarchyID = empEntityHierarchyID;
    }

    public String getEmpCode() {
        return empCode;
    }

    public void setEmpCode(String empCode) {
        this.empCode = empCode;
    }

    public Long getEmpGenderMccID() {
        return empGenderMccID;
    }

    public void setEmpGenderMccID(Long empGenderMccID) {
        this.empGenderMccID = empGenderMccID;
    }

    public LocalDate getEmpDOB() {
        return empDOB;
    }

    public void setEmpDOB(LocalDate empDOB) {
        this.empDOB = empDOB;
    }

    public Long getEmpBloodGroupMccID() {
        return empBloodGroupMccID;
    }

    public void setEmpBloodGroupMccID(Long empBloodGroupMccID) {
        this.empBloodGroupMccID = empBloodGroupMccID;
    }

    public String getEmpPhotograph() {
        return empPhotograph;
    }

    public void setEmpPhotograph(String empPhotograph) {
        this.empPhotograph = empPhotograph;
    }

    public Long getEmpAddressID() {
        return empAddressID;
    }

    public void setEmpAddressID(Long empAddressID) {
        this.empAddressID = empAddressID;
    }

    public Boolean getEmpCorrespondanceYN() {
        return empCorrespondanceYN;
    }

    public void setEmpCorrespondanceYN(Boolean empCorrespondanceYN) {
        this.empCorrespondanceYN = empCorrespondanceYN;
    }

    public Long getEmpCorrespondanceAddressID() {
        return empCorrespondanceAddressID;
    }

    public void setEmpCorrespondanceAddressID(Long empCorrespondanceAddressID) {
        this.empCorrespondanceAddressID = empCorrespondanceAddressID;
    }

    public Long getEmpContactInfoID() {
        return empContactInfoID;
    }

    public void setEmpContactInfoID(Long empContactInfoID) {
        this.empContactInfoID = empContactInfoID;
    }

    public Long getEmpDocInfoID() {
        return empDocInfoID;
    }

    public void setEmpDocInfoID(Long empDocInfoID) {
        this.empDocInfoID = empDocInfoID;
    }

    public Boolean getEmpActiveYN() {
        return empActiveYN;
    }

    public void setEmpActiveYN(Boolean empActiveYN) {
        this.empActiveYN = empActiveYN;
    }

    public Boolean getEmpTransValidYN() {
        return empTransValidYN;
    }

    public void setEmpTransValidYN(Boolean empTransValidYN) {
        this.empTransValidYN = empTransValidYN;
    }

    public LocalDate getEmpActualDOB() {
        return empActualDOB;
    }

    public void setEmpActualDOB(LocalDate empActualDOB) {
        this.empActualDOB = empActualDOB;
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    public void setAuthorization(Authorization authorization) {
        this.authorization = authorization;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

}
