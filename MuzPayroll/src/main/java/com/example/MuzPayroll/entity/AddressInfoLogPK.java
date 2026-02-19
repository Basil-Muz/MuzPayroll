package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class AddressInfoLogPK implements Serializable {

    @Column(name = "AddressInfoID")
    private Long addressInfoID;

    public Long getAddressInfoID() {
        return addressInfoID;
    }

    public void setAddressInfoID(Long addressInfoID) {
        this.addressInfoID = addressInfoID;
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
    public AddressInfoLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public AddressInfoLogPK(Long addressInfoID, Long rowNo) {
        this.addressInfoID = addressInfoID;
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
        AddressInfoLogPK that = (AddressInfoLogPK) o;
        return Objects.equals(addressInfoID, that.addressInfoID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(addressInfoID, rowNo);
    }

    @Override
    public String toString() {
        return addressInfoID + "-" + rowNo;
    }
}
