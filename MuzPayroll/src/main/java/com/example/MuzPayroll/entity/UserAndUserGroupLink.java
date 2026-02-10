package com.example.MuzPayroll.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserAndUserGroupLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long UserAndUserGroupLinkID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "UugUserID", nullable = true)
    private UserMst userMst;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "UugUserGroupID", nullable = true)
    private UserGrpMst userGrpMst;

    public UserMst getUserMst() {
        return userMst;
    }

    public void setUserMst(UserMst userMst) {
        this.userMst = userMst;
    }

    public UserGrpMst getUserGrpMst() {
        return userGrpMst;
    }

    public void setUserGrpMst(UserGrpMst userGrpMst) {
        this.userGrpMst = userGrpMst;
    }

    public Long getUserAndUserGroupLinkID() {
        return UserAndUserGroupLinkID;
    }

    public void setUserAndUserGroupLinkID(Long UserAndUserGroupLinkID) {
        this.UserAndUserGroupLinkID = UserAndUserGroupLinkID;
    }

}
