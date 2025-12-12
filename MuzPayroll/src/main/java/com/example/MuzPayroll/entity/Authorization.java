package com.example.MuzPayroll.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "authorization_tbl")
public class Authorization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authId;

    @Column
    private Long mstId;

    @ManyToOne
    @JoinColumn(name = "user_code", referencedColumnName = "userCode", nullable = false)
    private UserMst userMst;

    @Column(nullable = false)
    private String authorizationDate;

    public String getAuthorizationDate() {
        return authorizationDate;
    }

    public void setAuthorizationDate(String authorizationDate) {
        this.authorizationDate = authorizationDate;
    }

    @Column(nullable = false)
    private String authorizationStatus;

    public String getAuthorizationStatus() {
        return authorizationStatus;
    }

    public void setAuthorizationStatus(String authorizationStatus) {
        this.authorizationStatus = authorizationStatus;
    }

    public Long getAuthId() {
        return authId;
    }

    public void setAuthId(Long authId) {
        this.authId = authId;
    }

    public Long getMstId() {
        return mstId;
    }

    public void setMstId(Long mstId) {
        this.mstId = mstId;
    }

    public UserMst getUserMst() {
        return userMst;
    }

    public void setUserMst(UserMst userMst) {
        this.userMst = userMst;
    }

}
