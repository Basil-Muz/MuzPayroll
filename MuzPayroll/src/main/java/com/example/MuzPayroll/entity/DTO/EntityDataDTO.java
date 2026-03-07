package com.example.MuzPayroll.entity.DTO;

public interface EntityDataDTO {
    Long getEtmEntityId();

    String getEtmPrefix();

    String getEtmCode();

    String getEtmName();

    String getEtmShortName();

    Boolean getEtmActiveYN();

    String getImagePath();

    Integer getEtmIntPrefix();

    Long getEtmEntityTypeMccID();

    java.time.LocalDate getActiveDate();

    java.time.LocalDate getInactiveDate();

    Long getEtmDocInfoID();

    Long getAddressInfoID();

    // Address fields
    String getAddress();

    String getAddress1();

    String getAddress2();

    String getCountry();

    String getState();

    String getDistrict();

    String getPlace();

    String getPincode();

    String getLandlineNumber();

    String getMobileNumber();

    String getEmail();

    java.time.LocalDate getWithaffectdate();

    // Employer
    String getEmployerName();

    String getDesignation();

    String getEmployerNumber();

    String getEmployerEmail();

    // Authorization
    Long getAuthId();

    Integer getAmendNo();

    java.time.LocalDate getAuthorizationDate();

    String getAuthorizationStatus();

    String getUserCode();

}
