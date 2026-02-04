package com.example.MuzPayroll.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// import com.example.MuzPayroll.entity.DTO.ForgotPasswordOtpRequest;



// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("MuzPayroll - OTP Verification");
            message.setText(
                "Your OTP for password reset is: " + otp +
                "\n\nThis OTP is valid for 10 minutes."
            );

            mailSender.send(message);

            System.out.println("OTP email sent to " + toEmail);

        } catch (Exception e) {
            // Do NOT break business flow
            System.err.println("OTP email sending failed: " + e.getMessage());
        }
    }
}
