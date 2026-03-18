package com.example.MuzPayroll.entity.DTO;

public class StatusUpdateDTO {

    private Long opmOptionID;

    private String opmName;

    public StatusUpdateDTO(Long opmOptionID, String opmName) {
        this.opmOptionID = opmOptionID;
        this.opmName = opmName;
    }

    public Long getOpmOptionID() {
        return opmOptionID;
    }

    public void setOpmOptionID(Long opmOptionID) {
        this.opmOptionID = opmOptionID;
    }

    public String getOpmName() {
        return opmName;
    }

    public void setOpmName(String opmName) {
        this.opmName = opmName;
    }

}
