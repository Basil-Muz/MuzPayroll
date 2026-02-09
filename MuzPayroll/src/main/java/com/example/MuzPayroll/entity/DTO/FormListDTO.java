package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

public class FormListDTO {
    private Long MstID;

    private String code;

    private String Name;

    private String shortName;

    private LocalDate activeDate;

    private Boolean activeStatusYN;

    private LocalDate InactiveDate;

    public Long getMstID() {
        return MstID;
    }

    public void setMstID(Long mstID) {
        MstID = mstID;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public LocalDate getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(LocalDate activeDate) {
        this.activeDate = activeDate;
    }

    public Boolean getActiveStatusYN() {
        return activeStatusYN;
    }

    public void setActiveStatusYN(Boolean activeStatusYN) {
        this.activeStatusYN = activeStatusYN;
    }

    public LocalDate getInactiveDate() {
        return InactiveDate;
    }

    public void setInactiveDate(LocalDate inactiveDate) {
        InactiveDate = inactiveDate;
    }

}
