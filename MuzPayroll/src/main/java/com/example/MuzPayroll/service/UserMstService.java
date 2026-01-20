package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.entity.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordResponse;
import com.example.MuzPayroll.entity.DTO.LoginRequest;
import com.example.MuzPayroll.entity.DTO.LoginResponse;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.BranchRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.LocationRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class UserMstService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CompanyRepository companyRepo;

    @Autowired
    private BranchRepository branchRepo;

    @Autowired
    private LocationRepository locationRepo;

    @Autowired
    private EmailService emailService;

    // ============================
    // LOGIN (AUTHENTICATION ONLY)
    // ============================
    public Response<LoginResponse> login(LoginRequest request) {

        List<String> errors = new ArrayList<>();

        if (request == null) {
            return Response.error("Login request cannot be null");
        }

        String userCode = request.getUserCode();
        if (userCode != null) {
            userCode = userCode.replace("@muziris", "");
        }
        if (userCode == null || userCode.isBlank()) {
            errors.add("User code is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            errors.add("Password is required");
        }

       
        UserMst user = userRepo.findByUserCode(userCode);

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            errors.add("Invalid user code or password");

        }
       if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        LoginResponse resp = new LoginResponse();
        resp.setSuccess(true);
        resp.setMessage("Login successful");

        // SEND ONLY IDs
        resp.setCompanyId(user.getCompanyEntity().getCompanyMstID());
        resp.setBranchId(user.getBranchEntity().getBranchMstID());
        resp.setLocationId(user.getLocationEntity().getLocationMstID());
        resp.setUserName(user.getUserName());

        // resp.setLocationName(user.getLocationEntity().getLocation());

        return Response.success(resp);
    }

    public Response<LoginResponse> getUserContext(Long companyId, Long branchId, Long locationId, String userCode) {
        List<String> errors = new ArrayList<>();

        if (userCode == null || userCode.isBlank()) {
            errors.add("User code is required");
        }

        if (companyId == null) {
            errors.add("Company ID is required");
        }

        if (branchId == null) {
            errors.add("Branch ID is required");
        }

        if (locationId == null) {
            errors.add("Location ID is required");
        }

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        UserMst user = userRepo.findByUserCode(userCode.replace("@muziris", ""));

        if (user == null) {
            return Response.error("User not found");
        }

        CompanyMst company = getCompany(companyId);
        if (company == null) {
            return Response.error("Company not found");
        }

        List<BranchMst> branches = getAllBranches(companyId);
        if (branches == null || branches.isEmpty()) {
            return Response.error("No branches found for company");
        }

        List<LocationMst> locations = getAllLocations(branchId);
        if (locations == null || locations.isEmpty()) {
            return Response.error("No locations found for branch");
        }
        LoginResponse resp = new LoginResponse();
        resp.setSuccess(true);
        resp.setUserName(user.getUserName());
        resp.setLocationName(user.getLocationEntity().getLocation());
        resp.setCompanyId(companyId);
        resp.setBranchId(branchId);
        resp.setLocationId(locationId);
        resp.setCompany(company);
        resp.setBranchList(branches);
        resp.setLocationList(locations);

        return Response.success(resp);
    }

    public CompanyMst getCompany(Long companyId) {
        return companyRepo.findById(companyId)
                .orElse(null);

    }

    public List<BranchMst> getAllBranches(Long companyId) {
        return branchRepo.findByCompanyEntity_CompanyMstID(companyId);
    }

    public List<LocationMst> getAllLocations(Long branchId) {
        return locationRepo.findAll()
                .stream()
                .filter(loc -> loc.getBranchEntity().getBranchMstID().equals(branchId))
                .toList();
    }

    // CHANGE PASSWORD
    public Response<Boolean> changePassword(ChangePasswordRequest request) {

    List<String> errors = new ArrayList<>();

    if (request == null) {
        return Response.error("Request cannot be null");
    }

    String userCode = request.getUserCode();
    if (userCode != null) {
        userCode = userCode.replace("@muziris", "");
    }

    if (userCode == null || userCode.isBlank()) {
        errors.add("User code is required");
    }

    if (request.getCurrentPassword() == null) {
        errors.add("Current password is required");
    }

    if (request.getNewPassword() == null) {
        errors.add("New password is required");
    }

    if (!errors.isEmpty()) {
        return Response.error(errors);
    }

    UserMst user = userRepo.findByUserCode(userCode);

    if (user == null) {
        return Response.error("User not found");
    }

    if (!user.getPassword().equals(request.getCurrentPassword())) {
        return Response.error("Current password is incorrect");
    }

    user.setPassword(request.getNewPassword());
    userRepo.save(user);

    return Response.success(true);
}

    // FORGOT PASSWORD
    // ============================
    public Response<ForgotPasswordResponse> forgotPassword(ForgotPasswordRequest request) {

    if (request == null || request.getUserCode() == null) {
        return Response.error("User code is required");
    }

    String userCode = request.getUserCode().replace("@muziris", "");

    UserMst user = userRepo.findByUserCode(userCode);

    if (user == null) {
        return Response.error("Invalid user code");
    }

    emailService.sendPassword(user.getEmail(), user.getPassword());

    ForgotPasswordResponse resp = new ForgotPasswordResponse();
    resp.setSuccess(true);
    resp.setMessage("Password sent to registered email");

    return Response.success(resp);
}

}
