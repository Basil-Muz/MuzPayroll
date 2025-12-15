package com.example.MuzPayroll.DTO;

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

    private List<CompanyMst> companyList;
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

    public List<CompanyMst> getCompanyList() {
        return companyList;
    }
    public void setCompanyList(List<CompanyMst> companyList) {
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
}
