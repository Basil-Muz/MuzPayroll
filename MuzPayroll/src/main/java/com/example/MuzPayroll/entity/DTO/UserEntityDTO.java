package com.example.MuzPayroll.entity.DTO;

public class UserEntityDTO {

    private Integer entityHierarchyId;

    private String entityName;

    private String entityType;

    public UserEntityDTO(Integer entityHierarchyId, String entityName, String entityType) {
        this.entityHierarchyId = entityHierarchyId;
        this.entityName = entityName;
        this.entityType = entityType;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public Integer getEntityHierarchyId() {
        return entityHierarchyId;
    }

    public void setEntityHierarchyId(Integer entityHierarchyId) {
        this.entityHierarchyId = entityHierarchyId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }
}
