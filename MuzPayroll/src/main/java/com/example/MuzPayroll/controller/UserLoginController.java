package com.example.MuzPayroll.controller;

import com.example.MuzPayroll.DTO.LoginRequest;
import com.example.MuzPayroll.DTO.LoginResponse;
import com.example.MuzPayroll.service.UserMstService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class UserLoginController {

    @Autowired
    private UserMstService service;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }
}
