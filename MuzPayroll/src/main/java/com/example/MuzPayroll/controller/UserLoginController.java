package com.example.MuzPayroll.controller;

import com.example.MuzPayroll.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.DTO.ForgotPasswordRequest;
import com.example.MuzPayroll.DTO.ForgotPasswordResponse;
import com.example.MuzPayroll.DTO.LoginRequest;
import com.example.MuzPayroll.DTO.LoginResponse;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.UserRepository;
import com.example.MuzPayroll.service.UserMstService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class UserLoginController {

    @Autowired
    private UserMstService service;


    @Autowired
    private UserRepository userRepo;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }
@GetMapping("/user-context")
public LoginResponse getUserContext(
        @RequestParam Long companyId,
        @RequestParam Long branchId,
        @RequestParam Long locationId,
        @RequestParam String userCode  
) {
    LoginResponse resp = new LoginResponse();

    UserMst user = userRepo.findByUserCode(userCode.replace("@muziris",""));

    resp.setUserName(user.getUserName());
    resp.setLocationName(user.getLocationEntity().getLocation());

    resp.setCompanyId(companyId);
    resp.setBranchId(branchId);
    resp.setLocationId(locationId);
    resp.setCompanyList(service.getAllCompanies());
    resp.setBranchList(service.getAllBranches());
    resp.setLocationList(service.getAllLocations());
    resp.setSuccess(true);

    return resp;
}
@PostMapping("/change-password")
public ResponseEntity<?> changePassword(
        @RequestBody ChangePasswordRequest request) {

    service.changePassword(request);
    return ResponseEntity.ok(
        Map.of("message", "Password changed successfully")
    );
}
@PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        return service.forgotPassword(request);
    }


}
