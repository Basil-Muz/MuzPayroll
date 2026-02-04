package com.example.MuzPayroll.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MuzPayroll.entity.PasswordOtp;

public interface PasswordOtpRepository
        extends JpaRepository<PasswordOtp, Long> {

    Optional<PasswordOtp> findTopByUserCodeAndOtpAndUsedFalseOrderByIdDesc(
            String userCode, String otp);

    Optional<PasswordOtp> findTopByUserCodeAndUsedTrueOrderByIdDesc(
            String userCode);

    void deleteByExpiryTimeBefore(LocalDateTime time);

}
