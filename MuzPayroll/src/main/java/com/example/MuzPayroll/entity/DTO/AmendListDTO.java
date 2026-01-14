package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

public class AmendListDTO {

    private Long MstID;

    private Long rowNo;

    private String amendNo;

    private LocalDate authorizationDate;

    private Boolean authorizationStatus;

    public Long getMstID() {
        return MstID;
    }

    public void setMstID(Long mstID) {
        MstID = mstID;
    }

    public Long getRowNo() {
        return rowNo;
    }

    public void setRowNo(Long rowNo) {
        this.rowNo = rowNo;
    }

    public String getAmendNo() {
        return amendNo;
    }

    public void setAmendNo(String amendNo) {
        this.amendNo = amendNo;
    }

    public LocalDate getAuthorizationDate() {
        return authorizationDate;
    }

    public void setAuthorizationDate(LocalDate authorizationDate) {
        this.authorizationDate = authorizationDate;
    }

    public Boolean getAuthorizationStatus() {
        return authorizationStatus;
    }

    public void setAuthorizationStatus(Boolean authorizationStatus) {
        this.authorizationStatus = authorizationStatus;
    }
}
