package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ProductMst {

    @Id
    @Column(name = "pmProductID", unique = true, nullable = false)
    private Long pmProductID;

    @Column(nullable = false)
    private String pmCode;

    @Column(nullable = false)
    private String pmName;

    @Column(nullable = false)
    private String pmShortName;

    public Long getPmProductID() {
        return pmProductID;
    }

    public void setPmProductID(Long pmProductID) {
        this.pmProductID = pmProductID;
    }

    public String getPmCode() {
        return pmCode;
    }

    public void setPmCode(String pmCode) {
        this.pmCode = pmCode;
    }

    public String getPmName() {
        return pmName;
    }

    public void setPmName(String pmName) {
        this.pmName = pmName;
    }

    public String getPmShortName() {
        return pmShortName;
    }

    public void setPmShortName(String pmShortName) {
        this.pmShortName = pmShortName;
    }
}
