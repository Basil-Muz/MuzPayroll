package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class OptionMst {

    @Id
    @Column(name = "OpmOptionID", unique = true, nullable = false)
    private Long OpmOptionID;

    @Column(nullable = false, unique = true)
    private String OpmCode;

    @Column(nullable = false)
    private String OpmName;

    @Column(nullable = false)
    private String OpmShortName;

    @Column(nullable = false)
    private String OpmOptionDesc;

    @Column(nullable = false)
    private String OpmOptionType;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "OpmProductID", nullable = false)
    private ProductMst productEntity;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "OpmModuleID", nullable = false)
    private ModuleMst moduleEntity;

    @Column(nullable = false)
    private String OpmURL;

    public String getOpmName() {
        return OpmName;
    }

    public void setOpmName(String opmName) {
        OpmName = opmName;
    }

    public Long getOpmOptionID() {
        return OpmOptionID;
    }

    public void setOpmOptionID(Long opmOptionID) {
        OpmOptionID = opmOptionID;
    }

    public String getOpmCode() {
        return OpmCode;
    }

    public void setOpmCode(String opmCode) {
        OpmCode = opmCode;
    }

    public String getOpmShortName() {
        return OpmShortName;
    }

    public void setOpmShortName(String opmShortName) {
        OpmShortName = opmShortName;
    }

    public String getOpmOptionDesc() {
        return OpmOptionDesc;
    }

    public void setOpmOptionDesc(String opmOptionDesc) {
        OpmOptionDesc = opmOptionDesc;
    }

    public String getOpmOptionType() {
        return OpmOptionType;
    }

    public void setOpmOptionType(String opmOptionType) {
        OpmOptionType = opmOptionType;
    }

    public String getOpmURL() {
        return OpmURL;
    }

    public void setOpmURL(String opmURL) {
        OpmURL = opmURL;
    }

    public ProductMst getProductEntity() {
        return productEntity;
    }

    public void setProductEntity(ProductMst productEntity) {
        this.productEntity = productEntity;
    }

    public ModuleMst getModuleEntity() {
        return moduleEntity;
    }

    public void setModuleEntity(ModuleMst moduleEntity) {
        this.moduleEntity = moduleEntity;
    }

}
