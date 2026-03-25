package com.example.MuzPayroll.entity.DTO;

public class LicenseAgreementDTO {

    private Long LicEntityHierarchyID;

    private Long licBranchs;

    private Long licLocations;

    private Long licUsers;

    public Long getLicEntityHierarchyID() {
        return LicEntityHierarchyID;
    }

    public void setLicEntityHierarchyID(Long LicEntityHierarchyID) {
        this.LicEntityHierarchyID = LicEntityHierarchyID;
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
}
