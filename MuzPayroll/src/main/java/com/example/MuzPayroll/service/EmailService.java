package com.example.MuzPayroll.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPassword(String toEmail, String password) {

        System.out.println("======================================");
        System.out.println("📧 FORGOT PASSWORD (DEV MODE)");
        System.out.println("To Email : " + toEmail);
        System.out.println("Password : " + password);
        System.out.println("======================================");
    }
}
