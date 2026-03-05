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

    // Constructors
    public EntityGrpRightsDTO() {
    }

    public EntityGrpRightsDTO(
            Long egrEntityGroupRightID,
            Long entityRightsGrpMstId,
            Long solutionMstId,
            Long optionMstId,
            Boolean egrAdd,
            Boolean egrEdit,
            Boolean egrView,
            Boolean egrDelete,
            Boolean egrPrint,
            Long lastModUserId,
            LocalDate egrLastModDate) {

        this.egrEntityGroupRightID = egrEntityGroupRightID;
        this.entityRightsGrpMstId = entityRightsGrpMstId;
        this.solutionMstId = solutionMstId;
        this.optionMstId = optionMstId;
        this.egrAdd = egrAdd;
        this.egrEdit = egrEdit;
        this.egrView = egrView;
        this.egrDelete = egrDelete;
        this.egrPrint = egrPrint;
        this.lastModUserId = lastModUserId;
        this.egrLastModDate = egrLastModDate;
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