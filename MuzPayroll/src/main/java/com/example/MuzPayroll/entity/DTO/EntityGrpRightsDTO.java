package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

public class EntityGrpRightsDTO {
    
    private Long egrEntityGroupRightID;

    private Long entityRightsGrpMstId;
    private Long solutionMstId;
    private Long optionMstId;
    private Long lastModUserId;

    private Boolean egrAdd;
    private Boolean egrEdit;
    private Boolean egrView;
    private Boolean egrDelete;
    private Boolean egrPrint;

    private LocalDate egrLastModDate;

    private String optionCode;
    
    private String optionType;
    
    private String moduleName;

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getOptionType() {
        return optionType;
    }

    public void setOptionType(String optionType) {
        this.optionType = optionType;
    }


    public String getOptionCode() {
        return optionCode;
    }

    public void setOptionCode(String optionCode) {
        this.optionCode = optionCode;
    }

    // Getters & Setters

    public Long getEgrEntityGroupRightID() {
        return egrEntityGroupRightID;
    }

    public void setEgrEntityGroupRightID(Long egrEntityGroupRightID) {
        this.egrEntityGroupRightID = egrEntityGroupRightID;
    }

    public Long getEntityRightsGrpMstId() {
        return entityRightsGrpMstId;
    }

    public void setEntityRightsGrpMstId(Long entityRightsGrpMstId) {
        this.entityRightsGrpMstId = entityRightsGrpMstId;
    }

    public Long getSolutionMstId() {
        return solutionMstId;
    }

    public void setSolutionMstId(Long solutionMstId) {
        this.solutionMstId = solutionMstId;
    }

    public Long getOptionMstId() {
        return optionMstId;
    }

    public void setOptionMstId(Long optionMstId) {
        this.optionMstId = optionMstId;
    }

    public Boolean getEgrAdd() {
        return egrAdd;
    }

    public void setEgrAdd(Boolean egrAdd) {
        this.egrAdd = egrAdd;
    }

    public Boolean getEgrEdit() {
        return egrEdit;
    }

    public void setEgrEdit(Boolean egrEdit) {
        this.egrEdit = egrEdit;
    }

    public Boolean getEgrView() {
        return egrView;
    }

    public void setEgrView(Boolean egrView) {
        this.egrView = egrView;
    }

    public Boolean getEgrDelete() {
        return egrDelete;
    }

    public void setEgrDelete(Boolean egrDelete) {
        this.egrDelete = egrDelete;
    }

    public Boolean getEgrPrint() {
        return egrPrint;
    }

    public void setEgrPrint(Boolean egrPrint) {
        this.egrPrint = egrPrint;
    }

    public Long getLastModUserId() {
        return lastModUserId;
    }

    public void setLastModUserId(Long lastModUserId) {
        this.lastModUserId = lastModUserId;
    }

    public LocalDate getEgrLastModDate() {
        return egrLastModDate;
    }

    public void setEgrLastModDate(LocalDate egrLastModDate) {
        this.egrLastModDate = egrLastModDate;
    }
}