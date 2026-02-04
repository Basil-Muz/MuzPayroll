package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ModuleMst {

    @Id
    @Column(name = "MomModuleID", unique = true, nullable = false)
    private Long MomModuleID;

    @Column(nullable = false)
    private String MomModuleCode;

    @Column(nullable = false)
    private String MomModuleName;

    @Column(nullable = false)
    private String MomModuleShortname;

    public Long getMomModuleID() {
        return MomModuleID;
    }

    public void setMomModuleID(Long momModuleID) {
        MomModuleID = momModuleID;
    }

    public String getMomModuleCode() {
        return MomModuleCode;
    }

    public void setMomModuleCode(String momModuleCode) {
        MomModuleCode = momModuleCode;
    }

    public String getMomModuleShortname() {
        return MomModuleShortname;
    }

    public void setMomModuleShortname(String momModuleShortname) {
        MomModuleShortname = momModuleShortname;
    }

    public String getMomModuleName() {
        return MomModuleName;
    }

    public void setMomModuleName(String MomModuleName) {
        this.MomModuleName = MomModuleName;
    }

}
