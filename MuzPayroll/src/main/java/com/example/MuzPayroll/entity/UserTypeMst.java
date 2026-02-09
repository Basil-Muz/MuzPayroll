package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserTypeMst {

    @Id
    @Column(name = "UtmUserTypeID", unique = true, nullable = false)
    private Long UgmUserGroupID;

    @Column(nullable = false)
    private String UtmCode;

    @Column(nullable = false)
    private String UtmName;

    @Column(nullable = false)
    private String UtmShortName;

    public Long getUgmUserGroupID() {
        return UgmUserGroupID;
    }

    public void setUgmUserGroupID(Long UgmUserGroupID) {
        this.UgmUserGroupID = UgmUserGroupID;
    }

    public String getUtmCode() {
        return UtmCode;
    }

    public void setUtmCode(String UtmCode) {
        this.UtmCode = UtmCode;
    }

    public String getUtmName() {
        return UtmName;
    }

    public void setUtmName(String UtmName) {
        this.UtmName = UtmName;
    }

    public String getUtmShortName() {
        return UtmShortName;
    }

    public void setUtmShortName(String UtmShortName) {
        this.UtmShortName = UtmShortName;
    }
}
