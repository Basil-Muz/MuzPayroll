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
public class UserGrpRights {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long UserGrpRightsID;

    @ManyToOne
    @JoinColumn(name = "UgrUserGroupID", nullable = true)
    private UserGrpMst userGrpMst;

    @ManyToOne
    @JoinColumn(name = "UgrSolutionID", nullable = true)
    private SolutionMst solutionMst;

    @ManyToOne
    @JoinColumn(name = "UgrOptionID", nullable = true)
    private OptionMst optionMst;

    @Column(nullable = false)
    private Boolean UgrAdd;

    @Column(nullable = false)
    private Boolean UgrEdit;

    @Column(nullable = false)
    private Boolean UgrView;

    @Column(nullable = false)
    private Boolean UgrDelete;

    @Column(nullable = false)
    private Boolean UgrPrint;

    @ManyToOne
    @JoinColumn(name = "UgrLastModUserID", nullable = true)
    private UserMst userMst;

    @Column(nullable = false)
    private LocalDate UgrLastModDate;

    public Long getUserGrpRightsID() {
        return UserGrpRightsID;
    }

    public void setUserGrpRightsID(Long UserGrpRightsID) {
        this.UserGrpRightsID = UserGrpRightsID;
    }

    public UserGrpMst getUserGrpMst() {
        return userGrpMst;
    }

    public void setUserGrpMst(UserGrpMst userGrpMst) {
        this.userGrpMst = userGrpMst;
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

    public Boolean getUgrAdd() {
        return UgrAdd;
    }

    public void setUgrAdd(Boolean UgrAdd) {
        this.UgrAdd = UgrAdd;
    }

    public Boolean getUgrEdit() {
        return UgrEdit;
    }

    public void setUgrEdit(Boolean UgrEdit) {
        this.UgrEdit = UgrEdit;
    }

    public Boolean getUgrView() {
        return UgrView;
    }

    public void setUgrView(Boolean UgrView) {
        this.UgrView = UgrView;
    }

    public Boolean getUgrDelete() {
        return UgrDelete;
    }

    public void setUgrDelete(Boolean UgrDelete) {
        this.UgrDelete = UgrDelete;
    }

    public Boolean getUgrPrint() {
        return UgrPrint;
    }

    public void setUgrPrint(Boolean UgrPrint) {
        this.UgrPrint = UgrPrint;
    }

    public UserMst getUserMst() {
        return userMst;
    }

    public void setUserMst(UserMst userMst) {
        this.userMst = userMst;
    }

    public LocalDate getUgrLastModDate() {
        return UgrLastModDate;
    }

    public void setUgrLastModDate(LocalDate UgrLastModDate) {
        this.UgrLastModDate = UgrLastModDate;
    }

}
