package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EntityGrpRightsLink {

    @Id
    @ManyToOne
    @JoinColumn(name = "EglSolutionID", nullable = false)
    private SolutionMst solutionMst;

    @ManyToOne
    @JoinColumn(name = "EglEntityHierarchyID", nullable = false)
    private EntityHierarchyInfo entityHierarchyInfo;

    @ManyToOne
    @JoinColumn(name = "EglEntityGroupRightsID", nullable = false)
    private EntityRightsGrpMst entityRightsGrpMst;

    @ManyToOne
    @JoinColumn(name = "EglLastModUserID", nullable = false)
    private UserMst userMst;

    @Column(nullable = false)
    private LocalDate EglLastModDate;

    public SolutionMst getSolutionMst() {
        return solutionMst;
    }

    public void setSolutionMst(SolutionMst solutionMst) {
        this.solutionMst = solutionMst;
    }

    public EntityHierarchyInfo getEntityHierarchyInfo() {
        return entityHierarchyInfo;
    }

    public void setEntityHierarchyInfo(EntityHierarchyInfo entityHierarchyInfo) {
        this.entityHierarchyInfo = entityHierarchyInfo;
    }

    public UserMst getUserMst() {
        return userMst;
    }

    public void setUserMst(UserMst userMst) {
        this.userMst = userMst;
    }

    public LocalDate getEglLastModDate() {
        return EglLastModDate;
    }

    public void setEglLastModDate(LocalDate EglLastModDate) {
        this.EglLastModDate = EglLastModDate;
    }

    public EntityRightsGrpMst getEntityRightsGrpMst() {
        return entityRightsGrpMst;
    }

    public void setEntityRightsGrpMst(EntityRightsGrpMst entityRightsGrpMst) {
        this.entityRightsGrpMst = entityRightsGrpMst;
    }

}
