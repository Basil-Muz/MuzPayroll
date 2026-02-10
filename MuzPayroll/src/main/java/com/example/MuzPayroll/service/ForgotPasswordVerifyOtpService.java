package com.example.MuzPayroll.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.PasswordOtp;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordVerifyRequestDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.PasswordOtpRepository;

@Service
public class ForgotPasswordVerifyOtpService
        extends MuzirisAbstractService<ForgotPasswordVerifyRequestDTO, PasswordOtp> {

    @Autowired
    private PasswordOtpRepository otpRepo;

    @Transactional
    public Response<Boolean> verifyOtp(
            ForgotPasswordVerifyRequestDTO request) {

        Response<ForgotPasswordVerifyRequestDTO> resp = save(List.of(request), "VERIFY_OTP");

        return resp.isSuccess()
                ? Response.success(true)
                : Response.error(resp.getErrors().get(0));
    }

    @Override
    public Response<Boolean> entityValidate(
            List<ForgotPasswordVerifyRequestDTO> dtos,
            String mode) {

        ForgotPasswordVerifyRequestDTO req = dtos.get(0);

        if (req.getUserCode() == null || req.getOtp() == null) {
            return Response.error("User code and OTP required");
        }

        return Response.success(true);
    }

    @Override
    public Response<Boolean> entityPopulate(
            List<ForgotPasswordVerifyRequestDTO> dtos,
            String mode) {

        ForgotPasswordVerifyRequestDTO req = dtos.get(0);

        Optional<PasswordOtp> otpOptional = otpRepo.findTopByUserCodeAndOtpAndUsedFalseOrderByIdDesc(
                req.getUserCode().replace("@muziris", ""), req.getOtp());

        if (otpOptional.isEmpty()) {
            return Response.error("Invalid OTP");
        }

        req.setVerified(false); // default

        dtos.get(0).setVerified(false);

        return Response.success(true);
    }

    @Override
    public Response<Boolean> businessValidate(
            List<ForgotPasswordVerifyRequestDTO> dtos,
            String mode) {

        ForgotPasswordVerifyRequestDTO req = dtos.get(0);

        Optional<PasswordOtp> otpOptional = otpRepo.findTopByUserCodeAndOtpAndUsedFalseOrderByIdDesc(
                req.getUserCode().replace("@muziris", ""),
                req.getOtp());

        if (otpOptional.isEmpty()) {
            return Response.error("Invalid OTP");
        }

        PasswordOtp otp = otpOptional.get();

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return Response.error("OTP expired");
        }

        return Response.success(true);
    }

    @Override
    public Response<Object> generatePK(
            List<ForgotPasswordVerifyRequestDTO> dtos,
            String mode) {

        // No PK generation required
        return Response.success(true);
    }

    @Override
    public Response<String> generateSerialNo(
            List<ForgotPasswordVerifyRequestDTO> dtos,
            String mode) {

        // No serial number required
        return Response.success(null);
    }

    @Override
    public Response<PasswordOtp> converttoEntity(
            List<ForgotPasswordVerifyRequestDTO> dtos) {

        ForgotPasswordVerifyRequestDTO req = dtos.get(0);

        Optional<PasswordOtp> otpOptional = otpRepo.findTopByUserCodeAndOtpAndUsedFalseOrderByIdDesc(
                req.getUserCode().replace("@muziris", ""),
                req.getOtp());

        PasswordOtp otp = otpOptional.get(); // unwrap Optional
        otp.setUsed(true);

        req.setVerified(true);

        PasswordOtp otp1 = otpOptional.get();
        return Response.success(otp1);
    }

    @Override
    protected PasswordOtp saveEntity(
            PasswordOtp entity,
            List<ForgotPasswordVerifyRequestDTO> dtos,
            String mode) {

        return otpRepo.save(entity);
    }

    @Override
    public ForgotPasswordVerifyRequestDTO entityToDto(PasswordOtp entity) {
        return null;
    }
}
