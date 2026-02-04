package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductThemeHdr {

    @Id
    @Column(name = "PthProductThemeID", unique = true, nullable = false)
    private Long PthProductThemeID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "PthSolutionID", nullable = false)
    private SolutionMst solutionEntity;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "PthProductID", nullable = false)
    private ProductMst productEntity;

    @Column(nullable = false)
    private Long PthAuthInfoID;

    @Column(nullable = false)
    private Boolean PthTransValidYN;

    public Long getPthProductThemeID() {
        return PthProductThemeID;
    }

    public void setPthProductThemeID(Long PthProductThemeID) {
        this.PthProductThemeID = PthProductThemeID;
    }

    public ProductMst getProductEntity() {
        return productEntity;
    }

    public void setProductEntity(ProductMst productEntity) {
        this.productEntity = productEntity;
    }

    public Long getPthAuthInfoID() {
        return PthAuthInfoID;
    }

    public void setPthAuthInfoID(Long PthAuthInfoID) {
        this.PthAuthInfoID = PthAuthInfoID;
    }

    public Boolean getPthTransValidYN() {
        return PthTransValidYN;
    }

    public void setPthTransValidYN(Boolean PthTransValidYN) {
        this.PthTransValidYN = PthTransValidYN;
    }

    public SolutionMst getSolutionEntity() {
        return solutionEntity;
    }

    public void setSolutionEntity(SolutionMst solutionEntity) {
        this.solutionEntity = solutionEntity;
    }
}
