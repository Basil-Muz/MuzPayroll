package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class CompanyLogPK implements Serializable {

    @Column(name = "company_mstid")
    private Long companyMstID;

    public Long getCompanyMstID() {
        return companyMstID;
    }

    public void setCompanyMstID(Long companyMstID) {
        this.companyMstID = companyMstID;
    }

    @Column(name = "row_no")
    private Long rowNo;

    public Long getRowNo() {
        return rowNo;
    }

    public void setRowNo(Long rowNo) {
        this.rowNo = rowNo;
    }

    // **ADDED: No-argument constructor**
    public CompanyLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public CompanyLogPK(Long companyMstID, Long rowNo) {
        this.companyMstID = companyMstID;
        this.rowNo = rowNo;
    }

    // Getters and setters...

    // **ADDED: equals() method**
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        CompanyLogPK that = (CompanyLogPK) o;
        return Objects.equals(companyMstID, that.companyMstID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(companyMstID, rowNo);
    }

    @Override
    public String toString() {
        return companyMstID + "-" + rowNo;
    }
}