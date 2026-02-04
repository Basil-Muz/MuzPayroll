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
public class ProductThemeDtl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ProductThemeDtlID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "PtdProductThemeID", nullable = false)
    private ProductThemeHdr productThemeHdr;

    @Column(nullable = false)
    private Long PtdRowNo;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "PtdOptionID", nullable = false)
    private OptionMst OptionEntity;

    @Column(nullable = false)
    private Boolean PtdAddProvYN;

    @Column(nullable = false)
    private Boolean PtdEditProvYN;

    @Column(nullable = false)
    private Boolean PtdDeleteProvYN;

    @Column(nullable = false)
    private Boolean PtdPrintProvYN;

    @Column(nullable = false)
    private Boolean PtdViewProvYN;

    @Column(nullable = false)
    private Long PtdSortOrder;

    public ProductThemeHdr getProductThemeHdr() {
        return productThemeHdr;
    }

    public void setProductThemeHdr(ProductThemeHdr productThemeHdr) {
        this.productThemeHdr = productThemeHdr;
    }

    public Long getPtdSortOrder() {
        return PtdSortOrder;
    }

    public void setPtdSortOrder(Long ptdSortOrder) {
        PtdSortOrder = ptdSortOrder;
    }

    public Long getPtdRowNo() {
        return PtdRowNo;
    }

    public void setPtdRowNo(Long PtdRowNo) {
        this.PtdRowNo = PtdRowNo;
    }

    public OptionMst getOptionEntity() {
        return OptionEntity;
    }

    public void setOptionEntity(OptionMst optionEntity) {
        OptionEntity = optionEntity;
    }

    public Boolean getPtdAddProvYN() {
        return PtdAddProvYN;
    }

    public void setPtdAddProvYN(Boolean PtdAddProvYN) {
        this.PtdAddProvYN = PtdAddProvYN;
    }

    public Boolean getPtdDeleteProvYN() {
        return PtdDeleteProvYN;
    }

    public void setPtdDeleteProvYN(Boolean PtdDeleteProvYN) {
        this.PtdDeleteProvYN = PtdDeleteProvYN;
    }

    public Boolean getPtdEditProvYN() {
        return PtdEditProvYN;
    }

    public void setPtdEditProvYN(Boolean PtdEditProvYN) {
        this.PtdEditProvYN = PtdEditProvYN;
    }

    public Boolean getPtdPrintProvYN() {
        return PtdPrintProvYN;
    }

    public void setPtdPrintProvYN(Boolean PtdPrintProvYN) {
        this.PtdPrintProvYN = PtdPrintProvYN;
    }

    public Boolean getPtdViewProvYN() {
        return PtdViewProvYN;
    }

    public void setPtdViewProvYN(Boolean PtdViewProvYN) {
        this.PtdViewProvYN = PtdViewProvYN;
    }

    public Long getProductThemeDtlID() {
        return ProductThemeDtlID;
    }

    public void setProductThemeDtlID(Long ProductThemeDtlID) {
        this.ProductThemeDtlID = ProductThemeDtlID;
    }

}
