package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EmpEntityAmendInfo {

    @Id
    @Column(name = "EeaEntityAmendinfoID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eeaEntityAmendinfoID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "EeaEmployeeID", nullable = false)
    private EmployeeMst eeaEmployeeID;

    @Column(nullable = true)
    private Long eeaAmendNo;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "EeaEntityHierarchyID", nullable = false)
    private EntityMst eeaEntityHierarchyID;

    public Long getEeaEntityAmendinfoID() {
        return eeaEntityAmendinfoID;
    }

    public void setEeaEntityAmendinfoID(Long eeaEntityAmendinfoID) {
        this.eeaEntityAmendinfoID = eeaEntityAmendinfoID;
    }

    public EmployeeMst getEeaEmployeeID() {
        return eeaEmployeeID;
    }

    public void setEeaEmployeeID(EmployeeMst eeaEmployeeID) {
        this.eeaEmployeeID = eeaEmployeeID;
    }

    public Long getEeaAmendNo() {
        return eeaAmendNo;
    }

    public void setEeaAmendNo(Long eeaAmendNo) {
        this.eeaAmendNo = eeaAmendNo;
    }

    public EntityMst getEeaEntityHierarchyID() {
        return eeaEntityHierarchyID;
    }

    public void setEeaEntityHierarchyID(EntityMst eeaEntityHierarchyID) {
        this.eeaEntityHierarchyID = eeaEntityHierarchyID;
    }
}
