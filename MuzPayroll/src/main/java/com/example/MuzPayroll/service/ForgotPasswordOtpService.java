package com.example.MuzPayroll.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.PasswordOtp;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordOtpRequestDTO;
//  import com.example.MuzPayroll.entity.DTO.ForgotPasswordVerifyRequest;
// import com.example.MuzPayroll.entity.DTO.ForgotPasswordResponse;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.PasswordOtpRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class ForgotPasswordOtpService
        extends MuzirisAbstractService<ForgotPasswordOtpRequestDTO, PasswordOtp> {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordOtpRepository otpRepo;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Response<Boolean> generateOtp(ForgotPasswordOtpRequestDTO request) {
        Response<ForgotPasswordOtpRequestDTO> resp = save(List.of(request), "GENERATE_OTP");

        return resp.isSuccess()
                ? Response.success(true)
                : Response.error(resp.getErrors().get(0));
    }

    // VALIDATION
    @Override
    public Response<Boolean> entityValidate(
            List<ForgotPasswordOtpRequestDTO> dtos, String mode) {

        if (dtos.get(0).getUserCode() == null) {
            return Response.error("User code required");
        }
        return Response.success(true);
    }

    // POPULATE
    @Override
    public Response<Boolean> entityPopulate(
            List<ForgotPasswordOtpRequestDTO> dtos, String mode) {

        ForgotPasswordOtpRequestDTO req = dtos.get(0);

        UserMst user = userRepo.findByUserCode(
                req.getUserCode().replace("@muziris", ""));

        if (user == null) {
            return Response.error("Invalid user code");
        }
        req.setEmail(user.getEmail());
        req.setUserCode(user.getUserCode());
        return Response.success(true);
    }

    // BUSINESS VALIDATION
    @Override
    public Response<Boolean> businessValidate(
            List<ForgotPasswordOtpRequestDTO> dtos, String mode) {
        return Response.success(true);
    }

    // PK
    @Override
    public Response<Object> generatePK(
            List<ForgotPasswordOtpRequestDTO> dtos, String mode) {
        return Response.success(true);
    }

    // SERIAL
    @Override
    public Response<String> generateSerialNo(
            List<ForgotPasswordOtpRequestDTO> dtos, String mode) {
        return Response.success(null);
    }

    // CONVERT → ENTITY
    @Override
    public Response<PasswordOtp> converttoEntity(
            List<ForgotPasswordOtpRequestDTO> dtos) {

        ForgotPasswordOtpRequestDTO req = dtos.get(0);

        String otp = String.format("%04d",
                new SecureRandom().nextInt(1_000_000));

        PasswordOtp entity = new PasswordOtp();
        entity.setUserCode(req.getUserCode());
        entity.setOtp(otp);
        entity.setUsed(false);
        entity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        req.setGeneratedOtp(otp);

        return Response.success(entity);
    }

    // SAVE ENTITY
    @Override
    protected PasswordOtp saveEntity(
            PasswordOtp entity,
            List<ForgotPasswordOtpRequestDTO> dtos,
            String mode) {

        PasswordOtp saved = otpRepo.save(entity);

        ForgotPasswordOtpRequestDTO req = dtos.get(0);

        emailService.sendOtp(
                req.getEmail(),
                req.getGeneratedOtp());

        return saved;
    }

    // 8ENTITY → DTO (NOT USED)
    @Override
    public ForgotPasswordOtpRequestDTO entityToDto(PasswordOtp entity) {
        return null;
    }
}
