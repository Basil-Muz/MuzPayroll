package com.example.MuzPayroll.entity.DTO;

import java.util.List;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.LocationMst;

public class LoginResponse {

    private boolean success;
    private String message;

    private Long companyId;
    private Long branchId;
    private Long locationId;
    private String token;

    private String userName;
    private String locationName;

    private CompanyMst companyList;
    private List<BranchMst> branchList;
    private List<LocationMst> locationList;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public CompanyMst getCompany() {
        return companyList;
    }

    public void setCompany(CompanyMst companyList) {
        this.companyList = companyList;
    }

    public List<BranchMst> getBranchList() {
        return branchList;
    }

    public void setBranchList(List<BranchMst> branchList) {
        this.branchList = branchList;
    }

    public List<LocationMst> getLocationList() {
        return locationList;
    }

    public void setLocationList(List<LocationMst> locationList) {
        this.locationList = locationList;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
