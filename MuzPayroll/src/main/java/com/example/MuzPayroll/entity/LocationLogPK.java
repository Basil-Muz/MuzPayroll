package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class LocationLogPK implements Serializable {

    @Column(name = "location_mstid")
    private Long locationMstID;

    public Long getLocationMstID() {
        return locationMstID;
    }

    public void setLocationMstID(Long locationMstID) {
        this.locationMstID = locationMstID;
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
    public LocationLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public LocationLogPK(Long locationMstID, Long rowNo) {
        this.locationMstID = locationMstID;
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
        LocationLogPK that = (LocationLogPK) o;
        return Objects.equals(locationMstID, that.locationMstID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(locationMstID, rowNo);
    }

    @Override
    public String toString() {
        return locationMstID + "-" + rowNo;
    }
}
