package com.example.MuzPayroll.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class CompanyLogPK implements Serializable {

    @Column(name = "CompanyMstID")
    private Long companyMstID;

    @Column(name = "RowNo")
    private Long rowNo;

    public Long getRowNo() {
        return rowNo;
    }

    public void setRowNo(Long rowNo) {
        this.rowNo = rowNo;
    }

    public Long getCompanyMstID() {
        return companyMstID;
    }

    public void setCompanyMstID(Long companyMstID) {
        this.companyMstID = companyMstID;
    }

}
