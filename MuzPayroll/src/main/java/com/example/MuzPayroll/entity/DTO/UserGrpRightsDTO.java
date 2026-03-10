package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;

public class UserGrpRightsDTO {
        
    private Long ugrUserGroupRightID;
    private Long userGroupId;
    public Long getUserGroupId() {
        return userGroupId;
    }

    public void setUserGroupId(Long userGroupId) {
        this.userGroupId = userGroupId;
    }

    private Long solutionMstId;
    private Long optionMstId;
    private Long lastModUserId;

    private Boolean ugrAdd;
    private Boolean ugrEdit;
    private Boolean ugrView;
    private Boolean ugrDelete;
    private Boolean ugrPrint;

    private LocalDate ugrLastModDate;

    private String optionCode;
    
    private String optionType;
    
    private String moduleName;

    // Getters & Setters
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

    public Long getUgrUserGroupRightID() {
        return ugrUserGroupRightID;
    }

    public void setUgrUserGroupRightID(Long ugrUserGroupRightID) {
        this.ugrUserGroupRightID = ugrUserGroupRightID;
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

    public Boolean getUgrAdd() {
        return ugrAdd;
    }

    public void setUgrAdd(Boolean ugrAdd) {
        this.ugrAdd = ugrAdd;
    }

    public Boolean getUgrEdit() {
        return ugrEdit;
    }

    public void setUgrEdit(Boolean ugrEdit) {
        this.ugrEdit = ugrEdit;
    }

    public Boolean getUgrView() {
        return ugrView;
    }

    public void setUgrView(Boolean ugrView) {
        this.ugrView = ugrView;
    }

    public Boolean getUgrDelete() {
        return ugrDelete;
    }

    public void setUgrDelete(Boolean ugrDelete) {
        this.ugrDelete = ugrDelete;
    }

    public Boolean getUgrPrint() {
        return ugrPrint;
    }

    public void setUgrPrint(Boolean ugrPrint) {
        this.ugrPrint = ugrPrint;
    }

    public Long getLastModUserId() {
        return lastModUserId;
    }

    public void setLastModUserId(Long lastModUserId) {
        this.lastModUserId = lastModUserId;
    }

    public LocalDate getUgrLastModDate() {
        return ugrLastModDate;
    }

    public void setUgrLastModDate(LocalDate ugrLastModDate) {
        this.ugrLastModDate = ugrLastModDate;
    }
}
