package com.example.MuzPayroll.entity;

import java.time.LocalDateTime;
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
    private LocalDateTime authorizationDate;

    @Column(nullable = false)
    private boolean verified;

    @Column(nullable = false)
    private Integer userAttempts = 0;

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

    public LocalDateTime getAuthorizationDate() {
        return authorizationDate;
    }

    public void setAuthorizationDate(LocalDateTime authorizationDate) {
        this.authorizationDate = authorizationDate;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public Integer getUserAttempts() {
        return userAttempts;
    }

    public void setUserAttempts(Integer userAttempts) {
        this.userAttempts = userAttempts;
    }
}
