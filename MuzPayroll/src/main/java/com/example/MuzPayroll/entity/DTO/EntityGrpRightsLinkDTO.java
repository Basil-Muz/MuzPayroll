package com.example.MuzPayroll.entity.DTO;

import java.time.LocalDate;
import java.util.List;

public class EntityGrpRightsLinkDTO {

    private Long entityGrpRightsLinkID;

    private Long eglSolutionID;

    private Long eglEntityHierarchyID;

    private List<Long> eglEntityGroupRightsIDs;

    private Long LastModUserId;

    private LocalDate EglLastModDate;

    public LocalDate getEglLastModDate() {
        return EglLastModDate;
    }

    public void setEglLastModDate(LocalDate EglLastModDate) {
        this.EglLastModDate = EglLastModDate;
    }

    public Long getLastModUserId() {
        return LastModUserId;
    }

    public void setLastModUserId(Long LastModUserId) {
        this.LastModUserId = LastModUserId;
    }

    public Long getEglEntityHierarchyID() {
        return eglEntityHierarchyID;
    }

    public void setEglEntityHierarchyID(Long eglEntityHierarchyID) {
        this.eglEntityHierarchyID = eglEntityHierarchyID;
    }

    public Long getEglSolutionID() {
        return eglSolutionID;
    }

    public void setEglSolutionID(Long eglSolutionID) {
        this.eglSolutionID = eglSolutionID;
    }

    public Long getEntityGrpRightsLinkID() {
        return entityGrpRightsLinkID;
    }

    public void setEntityGrpRightsLinkID(Long entityGrpRightsLinkID) {
        this.entityGrpRightsLinkID = entityGrpRightsLinkID;
    }

    public List<Long> getEglEntityGroupRightsIDs() {
        return eglEntityGroupRightsIDs;
    }

    public void setEglEntityGroupRightsIDs(List<Long> eglEntityGroupRightsIDs) {
        this.eglEntityGroupRightsIDs = eglEntityGroupRightsIDs;
    }

}
