package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class SolutionMst {

    @Id
    @Column(name = "SomSolutionID", unique = true, nullable = false)
    private Long SomSolutionID;

    @Column(nullable = false)
    private String SomSolutionCode;

    @Column(nullable = false)
    private String SomSolutionName;

    @Column(nullable = false)
    private String SomSolutionShortname;

    public String getSomSolutionShortname() {
        return SomSolutionShortname;
    }

    public void setSomSolutionShortname(String SomSolutionShortname) {
        this.SomSolutionShortname = SomSolutionShortname;
    }

    public String getSomSolutionName() {
        return SomSolutionName;
    }

    public void setSomSolutionName(String SomSolutionName) {
        this.SomSolutionName = SomSolutionName;
    }

    public String getSomSolutionCode() {
        return SomSolutionCode;
    }

    public void setSomSolutionCode(String SomSolutionCode) {
        this.SomSolutionCode = SomSolutionCode;
    }

    public Long getSomSolutionID() {
        return SomSolutionID;
    }

    public void setSomSolutionID(Long SomSolutionID) {
        this.SomSolutionID = SomSolutionID;
    }
}
