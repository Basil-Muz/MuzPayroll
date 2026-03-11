package com.example.MuzPayroll.entity.DTO;

import java.util.List;

public class EntityGrpLinkDTO {

    public EntityGrpLinkDTO() {
    }

    public EntityGrpLinkDTO(Long entityHierarchyId,
            Long linkId,
            Long branchId,
            String branchName,
            String locationName,
            List<Long> groupId) {
        this.linkId = linkId;
        this.branchId = branchId;
        this.entityHierarchyId = entityHierarchyId;
        this.branchName = branchName;
        this.locationName = locationName;
        this.groupId = groupId;
    }

    private Long linkId;

    private Long branchId;

    private Long entityHierarchyId;

    public Long getEntityHierarchyId() {
        return entityHierarchyId;
    }

    public void setEntityHierarchyId(Long entityHierarchyId) {
        this.entityHierarchyId = entityHierarchyId;
    }

    private String branchName;

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    private String locationName;

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    private List<Long> groupId;

    public List<Long> getGroupId() {
        return groupId;
    }

    public void setGroupId(List<Long> groupId) {
        this.groupId = groupId;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public Long getLinkId() {
        return linkId;
    }

    public void setLinkId(Long linkId) {
        this.linkId = linkId;
    }

}
