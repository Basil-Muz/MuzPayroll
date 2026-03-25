package com.example.MuzPayroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

@Entity
public class LicenseAgreement {

    @Id
    @Column(name = "LicEntityHierarchyID")
    private Long licEntityHierarchyID;

    @MapsId
    @OneToOne
    @JoinColumn(name = "LicEntityHierarchyID")
    private EntityMst entityMst;

    @Column(nullable = true, columnDefinition = "BIGINT DEFAULT 0")
    private Long licBranchs = 0L;

    @Column(nullable = true, columnDefinition = "BIGINT DEFAULT 0")
    private Long licLocations = 0L;

    @Column(nullable = true, columnDefinition = "BIGINT DEFAULT 0")
    private Long licUsers = 0L;

    public EntityMst getEntityMst() {
        return entityMst;
    }

    public void setEntityMst(EntityMst entityMst) {
        this.entityMst = entityMst;
    }

    public Long getLicBranchs() {
        return licBranchs;
    }

    public void setLicBranchs(Long licBranchs) {
        this.licBranchs = licBranchs;
    }

    public Long getLicLocations() {
        return licLocations;
    }

    public void setLicLocations(Long licLocations) {
        this.licLocations = licLocations;
    }

    public Long getLicUsers() {
        return licUsers;
    }

    public void setLicUsers(Long licUsers) {
        this.licUsers = licUsers;
    }

    // public Long getLicEntityHierarchyID() {
    // return licEntityHierarchyID;
    // }

    // public void setLicEntityHierarchyID(Long licEntityHierarchyID) {
    // this.licEntityHierarchyID = licEntityHierarchyID;
    // }

    public Long getLicEntityHierarchyID() {
        return licEntityHierarchyID;
    }

    public void setLicEntityHierarchyID(Long licEntityHierarchyID) {
        this.licEntityHierarchyID = licEntityHierarchyID;
    }
}
