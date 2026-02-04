package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class MenuThemeDtl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long MtdMenuThemeDtlID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "MtdMenuThemeID", nullable = false)
    private MenuThemeHdr menuThemeHdrEntity;

    @Column(nullable = false)
    private Long MtdMenuRowNo;

    @Column(nullable = false)
    private Boolean MtdOptionYN;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "MtdOptionID", nullable = true)
    private OptionMst optionMst;

    @Column(nullable = true)
    private String MtdDisplayName;

    @Column(nullable = true)
    private String MtdGroupDesc;

    @Column(nullable = true)
    private Long MtdParentMenuRowNo;

    @Column(nullable = false)
    private Long MtdMenuLevelNo;

    @Column(nullable = false)
    private Long MtdSortOrder;

    public Long getMtdMenuThemeDtlID() {
        return MtdMenuThemeDtlID;
    }

    public void setMtdMenuThemeDtlID(Long MtdMenuThemeDtlID) {
        this.MtdMenuThemeDtlID = MtdMenuThemeDtlID;
    }

    public MenuThemeHdr getMenuThemeHdrEntity() {
        return menuThemeHdrEntity;
    }

    public void setMenuThemeHdrEntity(MenuThemeHdr menuThemeHdrEntity) {
        this.menuThemeHdrEntity = menuThemeHdrEntity;
    }

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
}
