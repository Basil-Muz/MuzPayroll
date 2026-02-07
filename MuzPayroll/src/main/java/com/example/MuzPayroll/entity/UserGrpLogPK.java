package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class UserGrpLogPK implements Serializable {

    @Column(name = "UgmUserGroupID")
    private Long ugmUserGroupID;

    @Column(name = "row_no")
    private Long rowNo;

    public Long getRowNo() {
        return rowNo;
    }

    public void setRowNo(Long rowNo) {
        this.rowNo = rowNo;
    }

    // **ADDED: No-argument constructor**
    public UserGrpLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public UserGrpLogPK(Long ugmUserGroupID, Long rowNo) {
        this.ugmUserGroupID = ugmUserGroupID;
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
        UserGrpLogPK that = (UserGrpLogPK) o;
        return Objects.equals(ugmUserGroupID, that.ugmUserGroupID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(ugmUserGroupID, rowNo);
    }

    @Override
    public String toString() {
        return ugmUserGroupID + "-" + rowNo;
    }

    public Long getUgmUserGroupID() {
        return ugmUserGroupID;
    }

    public void setUgmUserGroupID(Long ugmUserGroupID) {
        this.ugmUserGroupID = ugmUserGroupID;
    }

}
