package com.example.MuzPayroll.service;

import java.time.LocalDateTime;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

// import com.example.MuzPayroll.entity.PasswordOtp;
import com.example.MuzPayroll.repository.PasswordOtpRepository;

import jakarta.transaction.Transactional;

@Service
public class CleanupService {

    private final PasswordOtpRepository otpRepository;

    public CleanupService(PasswordOtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    @Transactional   // ⭐ THIS IS THE FIX
    @Scheduled(fixedRate = 300000) // every 5 minutes
    public void cleanupOtp() {
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
    }
}

