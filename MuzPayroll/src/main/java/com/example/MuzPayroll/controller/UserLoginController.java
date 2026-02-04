package com.example.MuzPayroll.controller;

import com.example.MuzPayroll.entity.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordChangeRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordOtpRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordVerifyRequest;
import com.example.MuzPayroll.entity.DTO.LoginRequest;
import com.example.MuzPayroll.entity.DTO.LoginResponse;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.service.ChangePasswordService;
import com.example.MuzPayroll.service.ForgotChangePasswordService;
import com.example.MuzPayroll.service.ForgotPasswordOtpService;
import com.example.MuzPayroll.service.ForgotPasswordVerifyOtpService;
import com.example.MuzPayroll.service.UserMstService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class UserLoginController {

    @Autowired
    private UserMstService service;

    @Autowired
    private ChangePasswordService changeservice;

    @Autowired
    private ForgotChangePasswordService passwordservice;

    @Autowired
    private ForgotPasswordOtpService otpservice;

    @Autowired
    private ForgotPasswordVerifyOtpService VerifyOtpService;

    @PostMapping("/login")
    public ResponseEntity<Response<LoginResponse>> login(
            @RequestBody LoginRequest request) {

        Response<LoginResponse> response = service.login(request);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    // ================= USER CONTEXT =================
    @GetMapping("/user-context")
    public ResponseEntity<Response<LoginResponse>> getUserContext(
            @RequestParam Long companyId,
            @RequestParam Long branchId,
            @RequestParam Long locationId,
            @RequestParam String userCode) {

        Response<LoginResponse> response = service.getUserContext(companyId, branchId, locationId, userCode);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Response<Boolean>> changePassword(
            @RequestBody ChangePasswordRequest request) {

        Response<Boolean> response = changeservice.changePassword(request);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password/change-password")
    public ResponseEntity<Response<Boolean>> forgotChangePassword(
            @RequestBody ForgotPasswordChangeRequest request) {

        Response<Boolean> response = passwordservice.changePassword(request);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<Response<Boolean>> sendOtp(
            @RequestBody ForgotPasswordOtpRequest request) {

        Response<Boolean> response = otpservice.generateOtp(request);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Response<Boolean>> verifyOtp(
            @RequestBody ForgotPasswordVerifyRequest request) {

        Response<Boolean> response = VerifyOtpService.verifyOtp(request);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .badRequest() 
                    .body(response);
        }

         return ResponseEntity.ok(response);
    }

}
