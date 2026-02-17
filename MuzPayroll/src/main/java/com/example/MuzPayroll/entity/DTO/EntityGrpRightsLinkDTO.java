package com.example.MuzPayroll.entity.DTO;

public class EntityGrpRightsLinkDTO {

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

    private String groupName;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public EntityGrpRightsLinkDTO() {
    }

    public EntityGrpRightsLinkDTO(Long entityHierarchyId,
            String branchName,
            String locationName,
            String groupName) {
        this.entityHierarchyId = entityHierarchyId;
        this.branchName = branchName;
        this.locationName = locationName;
        this.groupName = groupName;
    }

}
