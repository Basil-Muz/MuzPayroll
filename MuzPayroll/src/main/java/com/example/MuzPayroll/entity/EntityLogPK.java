package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class EntityLogPK implements Serializable {

    @Column(name = "EtmEntityID")
    private Long etmEntityID;

    public Long getEtmEntityID() {
        return etmEntityID;
    }

    public void setEtmEntityID(Long etmEntityID) {
        this.etmEntityID = etmEntityID;
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
    public EntityLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public EntityLogPK(Long etmEntityID, Long rowNo) {
        this.etmEntityID = etmEntityID;
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
        EntityLogPK that = (EntityLogPK) o;
        return Objects.equals(etmEntityID, that.etmEntityID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(etmEntityID, rowNo);
    }

    @Override
    public String toString() {
        return etmEntityID + "-" + rowNo;
    }
}
