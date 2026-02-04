package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class MenuThemeHdr {

    @Id
    @Column(name = "MthMenuThemeID", unique = true, nullable = false)
    private Long MthMenuThemeID;

    @Column(nullable = false)
    private Long MthEntityHierarchyID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "MthSolutionID", nullable = false)
    private SolutionMst solutionEntity;

    @Column(nullable = false)
    private String MthMenuThemeCode;

    @Column(nullable = false)
    private String MthMenuThemeName;

    @Column(nullable = false)
    private Long MthSystemDefined;

    @Column(nullable = false)
    private Long MthAuthInfoID;

    @Column(nullable = false)
    private Boolean MthTransValidYN;

    public Long getMthMenuThemeID() {
        return MthMenuThemeID;
    }

    public void setMthMenuThemeID(Long MthMenuThemeID) {
        this.MthMenuThemeID = MthMenuThemeID;
    }

    public Long getMthEntityHierarchyID() {
        return MthEntityHierarchyID;
    }

    public void setMthEntityHierarchyID(Long MthEntityHierarchyID) {
        this.MthEntityHierarchyID = MthEntityHierarchyID;
    }

    public SolutionMst getSolutionEntity() {
        return solutionEntity;
    }

    public void setSolutionEntity(SolutionMst solutionEntity) {
        this.solutionEntity = solutionEntity;
    }

    public String getMthMenuThemeName() {
        return MthMenuThemeName;
    }

    public void setMthMenuThemeName(String MthMenuThemeName) {
        this.MthMenuThemeName = MthMenuThemeName;
    }

    public String getMthMenuThemeCode() {
        return MthMenuThemeCode;
    }

    public void setMthMenuThemeCode(String MthMenuThemeCode) {
        this.MthMenuThemeCode = MthMenuThemeCode;
    }

    public Long getMthSystemDefined() {
        return MthSystemDefined;
    }

    public void setMthSystemDefined(Long MthSystemDefined) {
        this.MthSystemDefined = MthSystemDefined;
    }

    public Long getMthAuthInfoID() {
        return MthAuthInfoID;
    }

    public void setMthAuthInfoID(Long MthAuthInfoID) {
        this.MthAuthInfoID = MthAuthInfoID;
    }

    public Boolean getMthTransValidYN() {
        return MthTransValidYN;
    }

    public void setMthTransValidYN(Boolean MthTransValidYN) {
        this.MthTransValidYN = MthTransValidYN;
    }

}
