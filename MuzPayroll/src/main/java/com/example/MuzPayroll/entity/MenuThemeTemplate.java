package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "menu_theme_template")
public class MenuThemeTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solution_id")
    private SolutionMst solution;

    private Long MtdMenuRowNo;

    private Boolean MtdOptionYN;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "MtdOptionID", nullable = true)
    private OptionMst optionMst;

    private String MtdDisplayName;

    private String MtdGroupDesc;

    private Long MtdParentMenuRowNo;

    private Long MtdMenuLevelNo;

    private Long MtdSortOrder;

    public Long getMtdMenuRowNo() {
        return MtdMenuRowNo;
    }

    public void setMtdMenuRowNo(Long MtdMenuRowNo) {
        this.MtdMenuRowNo = MtdMenuRowNo;
    }

    public Boolean getMtdOptionYN() {
        return MtdOptionYN;
    }

    public void setMtdOptionYN(Boolean MtdOptionYN) {
        this.MtdOptionYN = MtdOptionYN;
    }

    public OptionMst getOptionMst() {
        return optionMst;
    }

    public void setOptionMst(OptionMst optionMst) {
        this.optionMst = optionMst;
    }

    public String getMtdDisplayName() {
        return MtdDisplayName;
    }

    public void setMtdDisplayName(String MtdDisplayName) {
        this.MtdDisplayName = MtdDisplayName;
    }

    public String getMtdGroupDesc() {
        return MtdGroupDesc;
    }

    public void setMtdGroupDesc(String MtdGroupDesc) {
        this.MtdGroupDesc = MtdGroupDesc;
    }

    public Long getMtdParentMenuRowNo() {
        return MtdParentMenuRowNo;
    }

    public void setMtdParentMenuRowNo(Long MtdParentMenuRowNo) {
        this.MtdParentMenuRowNo = MtdParentMenuRowNo;
    }

    public Long getMtdMenuLevelNo() {
        return MtdMenuLevelNo;
    }

    public void setMtdMenuLevelNo(Long MtdMenuLevelNo) {
        this.MtdMenuLevelNo = MtdMenuLevelNo;
    }

    public Long getMtdSortOrder() {
        return MtdSortOrder;
    }

    public void setMtdSortOrder(Long MtdSortOrder) {
        this.MtdSortOrder = MtdSortOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SolutionMst getSolution() {
        return solution;
    }

    public void setSolution(SolutionMst solution) {
        this.solution = solution;
    }
}
