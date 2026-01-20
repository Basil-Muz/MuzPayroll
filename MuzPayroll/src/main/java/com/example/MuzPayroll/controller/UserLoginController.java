package com.example.MuzPayroll.controller;

import com.example.MuzPayroll.entity.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordResponse;
import com.example.MuzPayroll.entity.DTO.LoginRequest;
import com.example.MuzPayroll.entity.DTO.LoginResponse;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.service.UserMstService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class UserLoginController {

    @Autowired
    private UserMstService service;

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

        Response<Boolean> response = service.changePassword(request);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Response<ForgotPasswordResponse>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        Response<ForgotPasswordResponse> response = service.forgotPassword(request);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }
}
