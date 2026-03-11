package com.example.MuzPayroll.entity.DTO;

import java.util.List;

import com.example.MuzPayroll.entity.UserAndEntityLink;
import com.example.MuzPayroll.entity.UserAndUserGroupLink;

public class UserSettingsResponseDTO {
    
    private Long id;

    private String name;

    private String code;

    private List<GroupDTO> groups;

    private List<EntityDTO> entity;

    private List<UserAndEntityLink> userAndEntityLink;

    private List<UserAndUserGroupLink> userAndUserGroupLink;

    public List<UserAndUserGroupLink> getUserAndUserGroupLink() {
        return userAndUserGroupLink;
    }

    public void setUserAndUserGroupLink(List<UserAndUserGroupLink> userAndUserGroupLink) {
        this.userAndUserGroupLink = userAndUserGroupLink;
    }

    public List<UserAndEntityLink> getUserAndEntityLink() {
        return userAndEntityLink;
    }

    public void setUserAndEntityLink(List<UserAndEntityLink> userAndEntityLink) {
        this.userAndEntityLink = userAndEntityLink;
    }

    public List<GroupDTO> getGroups() {
        return groups;
    }

    public void setGroups(List<GroupDTO> groups) {
        this.groups = groups;
    }

    public List<EntityDTO> getEntity() {
        return entity;
    }

    public void setEntity(List<EntityDTO> entity) {
        this.entity = entity;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
}
