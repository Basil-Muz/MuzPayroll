package com.example.MuzPayroll.entity;

import java.util.Objects;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class EntityRightsGrpLogPK {
     @Column(name = "ErmEntityRightsGroupID")
    private Long ermEntityRightsGroupID;

    @Column(name = "row_no")
    private Long rowNo;

    public Long getRowNo() {
        return rowNo;
    }

    public void setRowNo(Long rowNo) {
        this.rowNo = rowNo;
    }

    // **ADDED: No-argument constructor**
    public EntityRightsGrpLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public EntityRightsGrpLogPK(Long ermEntityRightsGroupID, Long rowNo) {
        this.ermEntityRightsGroupID = ermEntityRightsGroupID;
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
        EntityRightsGrpLogPK that = (EntityRightsGrpLogPK) o;
        return Objects.equals(ermEntityRightsGroupID, that.ermEntityRightsGroupID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(ermEntityRightsGroupID, rowNo);
    }

    @Override
    public String toString() {
        return ermEntityRightsGroupID + "-" + rowNo;
    }

    public Long getErmEntityRightsGroupID() {
        return ermEntityRightsGroupID;
    }

    public void setErmEntityRightsGroupID(Long ermEntityRightsGroupID) {
        this.ermEntityRightsGroupID = ermEntityRightsGroupID;
    }

}

