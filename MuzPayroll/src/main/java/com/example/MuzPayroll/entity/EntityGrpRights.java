package com.example.MuzPayroll.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EntityGrpRights {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long EgrEntityGroupRightID;

    @ManyToOne
    @JoinColumn(name = "EgrEntityGroupID", nullable = true)
    private EntityRightsGrpMst entityRightsGrpMst;

    @ManyToOne
    @JoinColumn(name = "EgrSolutionID", nullable = true)
    private SolutionMst solutionMst;

    @ManyToOne
    @JoinColumn(name = "EgrOptionID", nullable = true)
    private OptionMst optionMst;

    @Column(nullable = false)
    private Boolean EgrAdd;

    @Column(nullable = false)
    private Boolean EgrEdit;

    @Column(nullable = false)
    private Boolean EgrView;

    @Column(nullable = false)
    private Boolean EgrDelete;

    @Column(nullable = false)
    private Boolean EgrPrint;

    @ManyToOne
    @JoinColumn(name = "EgrLastModUserID", nullable = true)
    private UserMst userMst;

    @Column(nullable = false)
    private LocalDate EgrLastModDate;

    public EntityRightsGrpMst getEntityRightsGrpMst() {
        return entityRightsGrpMst;
    }

    public void setEntityRightsGrpMst(EntityRightsGrpMst entityRightsGrpMst) {
        this.entityRightsGrpMst = entityRightsGrpMst;
    }

    public SolutionMst getSolutionMst() {
        return solutionMst;
    }

    public void setSolutionMst(SolutionMst solutionMst) {
        this.solutionMst = solutionMst;
    }

    public OptionMst getOptionMst() {
        return optionMst;
    }

    public void setOptionMst(OptionMst optionMst) {
        this.optionMst = optionMst;
    }

    public Boolean getEgrAdd() {
        return EgrAdd;
    }

    public void setEgrAdd(Boolean EgrAdd) {
        this.EgrAdd = EgrAdd;
    }

    public Boolean getEgrEdit() {
        return EgrEdit;
    }

    public void setEgrEdit(Boolean EgrEdit) {
        this.EgrEdit = EgrEdit;
    }

    public Boolean getEgrView() {
        return EgrView;
    }

    public void setEgrView(Boolean EgrView) {
        this.EgrView = EgrView;
    }

    public Boolean getEgrDelete() {
        return EgrDelete;
    }

    public void setEgrDelete(Boolean EgrDelete) {
        this.EgrDelete = EgrDelete;
    }

    public Boolean getEgrPrint() {
        return EgrPrint;
    }

    public void setEgrPrint(Boolean EgrPrint) {
        this.EgrPrint = EgrPrint;
    }

    public LocalDate getEgrLastModDate() {
        return EgrLastModDate;
    }

    public void setEgrLastModDate(LocalDate EgrLastModDate) {
        this.EgrLastModDate = EgrLastModDate;
    }

    public Long getEgrEntityGroupRightID() {
        return EgrEntityGroupRightID;
    }

    public void setEgrEntityGroupRightID(Long EgrEntityGroupRightID) {
        this.EgrEntityGroupRightID = EgrEntityGroupRightID;
    }

    public UserMst getUserMst() {
        return userMst;
    }

    public void setUserMst(UserMst userMst) {
        this.userMst = userMst;
    }
}
