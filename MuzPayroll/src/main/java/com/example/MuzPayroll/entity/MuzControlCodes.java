package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class MuzControlCodes {

    @Id
    @Column(name = "MccID", unique = true, nullable = false)
    private Long MccID;

    @Column(nullable = false)
    private String MccFlag;

    @Column(nullable = false)
    private String MccCode;

    @Column(nullable = false)
    private String MccName;

    @Column(nullable = false)
    private String MccShortName;

    @Column(nullable = false)
    private String MccDesc;

    @Column(nullable = false)
    private Long MccSortOrder;

    @Column(nullable = true)
    private Long MccEntityHierarchyID;

    @Column(nullable = true)
    private Long MccSubEntityHierarchyID;

    @Column(nullable = false)
    private String MccAuthInfoID;

    @Column(nullable = false)
    private String MccTransValidYN;

    public Long getMccID() {
        return MccID;
    }

    public void setMccID(Long MccID) {
        this.MccID = MccID;
    }

    public String getMccFlag() {
        return MccFlag;
    }

    public void setMccFlag(String MccFlag) {
        this.MccFlag = MccFlag;
    }

    public String getMccCode() {
        return MccCode;
    }

    public void setMccCode(String MccCode) {
        this.MccCode = MccCode;
    }

    public String getMccName() {
        return MccName;
    }

    public void setMccName(String MccName) {
        this.MccName = MccName;
    }

    public String getMccShortName() {
        return MccShortName;
    }

    public void setMccShortName(String MccShortName) {
        this.MccShortName = MccShortName;
    }

    public String getMccDesc() {
        return MccDesc;
    }

    public void setMccDesc(String MccDesc) {
        this.MccDesc = MccDesc;
    }

    public Long getMccSortOrder() {
        return MccSortOrder;
    }

    public void setMccSortOrder(Long MccSortOrder) {
        this.MccSortOrder = MccSortOrder;
    }

    public Long getMccEntityHierarchyID() {
        return MccEntityHierarchyID;
    }

    public void setMccEntityHierarchyID(Long MccEntityHierarchyID) {
        this.MccEntityHierarchyID = MccEntityHierarchyID;
    }

    public Long getMccSubEntityHierarchyID() {
        return MccSubEntityHierarchyID;
    }

    public void setMccSubEntityHierarchyID(Long MccSubEntityHierarchyID) {
        this.MccSubEntityHierarchyID = MccSubEntityHierarchyID;
    }

    public String getMccAuthInfoID() {
        return MccAuthInfoID;
    }

    public void setMccAuthInfoID(String MccAuthInfoID) {
        this.MccAuthInfoID = MccAuthInfoID;
    }

    public String getMccTransValidYN() {
        return MccTransValidYN;
    }

    public void setMccTransValidYN(String MccTransValidYN) {
        this.MccTransValidYN = MccTransValidYN;
    }
}
