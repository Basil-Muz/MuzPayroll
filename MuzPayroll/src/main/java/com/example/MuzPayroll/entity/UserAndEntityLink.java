package com.example.MuzPayroll.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserAndEntityLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long UserAndEntityLinkID;

    @ManyToOne
    @JoinColumn(name = "UelUserID", nullable = true)
    private UserMst userMst;

    @ManyToOne
    @JoinColumn(name = "UelEntityHierarchyID", nullable = true)
    private EntityHierarchyInfo entityHierarchyInfo;

    public UserMst getUserMst() {
        return userMst;
    }

    public void setUserMst(UserMst userMst) {
        this.userMst = userMst;
    }

    public EntityHierarchyInfo getEntityHierarchyInfo() {
        return entityHierarchyInfo;
    }

    public void setEntityHierarchyInfo(EntityHierarchyInfo entityHierarchyInfo) {
        this.entityHierarchyInfo = entityHierarchyInfo;
    }

    public Long getUserAndEntityLinkID() {
        return UserAndEntityLinkID;
    }

    public void setUserAndEntityLinkID(Long UserAndEntityLinkID) {
        this.UserAndEntityLinkID = UserAndEntityLinkID;
    }

}
