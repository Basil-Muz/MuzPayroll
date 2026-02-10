package com.example.MuzPayroll.controller;

import com.example.MuzPayroll.entity.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordChangeRequestDTO;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordOtpRequestDTO;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordVerifyRequestDTO;
import com.example.MuzPayroll.entity.DTO.LoginRequestDTO;
import com.example.MuzPayroll.entity.DTO.LoginResponseDTO;
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
    public ResponseEntity<Response<LoginResponseDTO>> login(
            @RequestBody LoginRequestDTO request) {

        Response<LoginResponseDTO> response = service.login(request);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    // ================= USER CONTEXT =================
    @GetMapping("/user-context")
    public ResponseEntity<Response<LoginResponseDTO>> getUserContext(
            @RequestParam Long companyId,
            @RequestParam Long branchId,
            @RequestParam Long locationId,
            @RequestParam String userCode) {

        Response<LoginResponseDTO> response = service.getUserContext(companyId, branchId, locationId, userCode);

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
            @RequestBody ForgotPasswordChangeRequestDTO request) {

        Response<Boolean> response = passwordservice.changePassword(request);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<Response<Boolean>> sendOtp(
            @RequestBody ForgotPasswordOtpRequestDTO request) {

        Response<Boolean> response = otpservice.generateOtp(request);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Response<Boolean>> verifyOtp(
            @RequestBody ForgotPasswordVerifyRequestDTO request) {

        Response<Boolean> response = VerifyOtpService.verifyOtp(request);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

}
