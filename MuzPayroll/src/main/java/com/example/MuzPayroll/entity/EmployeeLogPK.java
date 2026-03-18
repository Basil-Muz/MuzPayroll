package com.example.MuzPayroll.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class EmployeeLogPK implements Serializable {

    @Column(name = "EmpEmployeeID")
    private Long empEmployeeID;

    @Column(name = "row_no")
    private Long rowNo;

    public Long getEmpEmployeeID() {
        return empEmployeeID;
    }

    public void setEmpEmployeeID(Long empEmployeeID) {
        this.empEmployeeID = empEmployeeID;
    }

    public Long getRowNo() {
        return rowNo;
    }

    public void setRowNo(Long rowNo) {
        this.rowNo = rowNo;
    }

    // **ADDED: No-argument constructor**
    public EmployeeLogPK() {
    }

    // **ADDED: Constructor with parameters**
    public EmployeeLogPK(Long empEmployeeID, Long rowNo) {
        this.empEmployeeID = empEmployeeID;
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
        EmployeeLogPK that = (EmployeeLogPK) o;
        return Objects.equals(empEmployeeID, that.empEmployeeID) &&
                Objects.equals(rowNo, that.rowNo);
    }

    // **ADDED: hashCode() method**
    @Override
    public int hashCode() {
        return Objects.hash(empEmployeeID, rowNo);
    }

    @Override
    public String toString() {
        return empEmployeeID + "-" + rowNo;
    }

}
