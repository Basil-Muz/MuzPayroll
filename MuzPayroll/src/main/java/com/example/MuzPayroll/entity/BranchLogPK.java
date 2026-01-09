package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class BranchLogPK implements Serializable {

    @Column(name = "branch_mstid")
    private Long branchMstID;

    public Long getBranchMstID() {
        return branchMstID;
    }

    public void setBranchMstID(Long branchMstID) {
        this.branchMstID = branchMstID;
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
    public BranchLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public BranchLogPK(Long branchMstID, Long rowNo) {
        this.branchMstID = branchMstID;
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
        BranchLogPK that = (BranchLogPK) o;
        return Objects.equals(branchMstID, that.branchMstID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(branchMstID, rowNo);
    }

    @Override
    public String toString() {
        return branchMstID + "-" + rowNo;
    }
}
