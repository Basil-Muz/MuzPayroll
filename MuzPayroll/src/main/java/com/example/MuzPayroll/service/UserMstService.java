package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordResponse;
import com.example.MuzPayroll.entity.DTO.LoginRequest;
import com.example.MuzPayroll.entity.DTO.LoginResponse;
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
    public LoginResponse login(LoginRequest request) {

        LoginResponse resp = new LoginResponse();
        resp.setSuccess(false);

        String userCode = request.getUserCode();
        if (userCode != null) {
            userCode = userCode.replace("@muziris", "");
        }

        UserMst user = userRepo.findByUserCode(userCode);

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            resp.setMessage("Invalid login");
            return resp;
        }
        System.out.println("USER NAME FROM ENTITY: " + user.getUserName());
        System.out.println("LOCATION ENTITY: " + user.getLocationEntity());
        System.out.println(
                "LOCATION NAME: " +
                        (user.getLocationEntity() != null ? user.getLocationEntity().getLocation() : "NULL"));

        resp.setSuccess(true);
        resp.setMessage("Login successful");

        // SEND ONLY IDs
        resp.setCompanyId(user.getCompanyEntity().getCompanyMstID());
        resp.setBranchId(user.getBranchEntity().getId());
        resp.setLocationId(user.getLocationEntity().getId());

        resp.setUserName(user.getUserName());
        resp.setLocationName(user.getLocationEntity().getLocation());

        return resp;
    }

    // ============================
    // CONTEXT DATA (DROPDOWNS)
    // ============================
    public List<CompanyMst> getAllCompanies() {
        return companyRepo.findAll();
    }

    public List<BranchMst> getAllBranches() {
        return branchRepo.findAll();
    }

    public List<LocationMst> getAllLocations() {
        return locationRepo.findAll();
    }

    public void changePassword(ChangePasswordRequest request) {

        String userCode = request.getUserCode();
        if (userCode != null) {
            userCode = userCode.replace("@muziris", "");
        }

        UserMst user = userRepo.findByUserCode(userCode);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Verify current password (plain text)
        if (!user.getPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update new password (plain text)
        user.setPassword(request.getNewPassword());
        userRepo.save(user);
    }

    // ============================
    // FORGOT PASSWORD
    // ============================
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {

        ForgotPasswordResponse resp = new ForgotPasswordResponse();

        String userCode = request.getUserCode();
        if (userCode != null) {
            userCode = userCode.replace("@muziris", "");
        }

        UserMst user = userRepo.findByUserCode(userCode);

        if (user == null) {
            resp.setSuccess(false);
            resp.setMessage("Invalid user code");
            return resp;
        }

        // Send password to registered email
        emailService.sendPassword(user.getEmail(), user.getPassword());

        resp.setSuccess(true);
        resp.setMessage("Password sent to registered email");
        return resp;
    }

}
