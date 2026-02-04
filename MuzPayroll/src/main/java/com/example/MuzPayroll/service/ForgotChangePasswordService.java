package com.example.MuzPayroll.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.PasswordOtp;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordChangeRequest;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.PasswordOtpRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class ForgotChangePasswordService
        extends MuzirisAbstractService<ForgotPasswordChangeRequest, UserMst> {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordOtpRepository otpRepo;

    @Transactional
    public Response<Boolean> changePassword(
            ForgotPasswordChangeRequest request) {

        Response<ForgotPasswordChangeRequest> resp = save(List.of(request), "FORGOT_PASSWORD_CHANGE");

        return resp.isSuccess()
                ? Response.success(true)
                : Response.error(resp.getErrors().get(0));
    }

    @Override
    public Response<Boolean> entityValidate(
            List<ForgotPasswordChangeRequest> dtos,
            String mode) {

        ForgotPasswordChangeRequest req = dtos.get(0);

        if (req.getUserCode() == null || req.getUserCode().isBlank()) {
            return Response.error("User code required");
        }

        if (req.getNewPassword() == null || req.getConfirmPassword() == null) {
            return Response.error("Password fields required");
        }

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            return Response.error("Passwords do not match");
        }

        String userCode = req.getUserCode().replace("@muziris", "");

        Optional<PasswordOtp> verifiedOtp = otpRepo.findTopByUserCodeAndUsedTrueOrderByIdDesc(userCode);

        if (verifiedOtp.isEmpty()) {
            return Response.error("OTP not verified");
        }

        if (verifiedOtp.get().getExpiryTime().isBefore(LocalDateTime.now())) {
            return Response.error("OTP expired");
        }

        return Response.success(true);
    }

    @Override
    public Response<Boolean> entityPopulate(
            List<ForgotPasswordChangeRequest> dtos,
            String mode) {

        ForgotPasswordChangeRequest req = dtos.get(0);

        UserMst user = userRepo.findByUserCode(
                req.getUserCode().replace("@muziris", ""));

        if (user == null) {
            return Response.error("Invalid user");
        }

        return Response.success(true);
    }

    @Override
    public Response<Boolean> businessValidate(List<ForgotPasswordChangeRequest> dtos, String mode) {

        ForgotPasswordChangeRequest req = dtos.get(0);

        UserMst user = userRepo.findByUserCode(
                req.getUserCode().replace("@muziris", ""));

        if (user == null) {
            return Response.error("Invalid user");
        }

        String newPassword = req.getNewPassword();
        String oldPassword = user.getPassword();

        //  SAME AS OLD PASSWORD
        if (newPassword.equals(oldPassword)) {
            return Response.error("New password cannot be same as old password");
        }

        //  Password length rule
        if (newPassword.length() < 2) {
            return Response.error("Password must be at least 2 characters long");
        }

        //  No spaces
        if (newPassword.contains(" ")) {
            return Response.error("Password must not contain spaces");
        }
        return Response.success(true);
    }

    @Override
    public Response<Object> generatePK(
            List<ForgotPasswordChangeRequest> dtos,
            String mode) {

        // No PK generation needed here
        return Response.success(true);
    }

    @Override
    public Response<String> generateSerialNo(
            List<ForgotPasswordChangeRequest> dtos,
            String mode) {

        // No serial number needed
        return Response.success(null);
    }

    @Override
    public Response<UserMst> converttoEntity(
            List<ForgotPasswordChangeRequest> dtos) {

        ForgotPasswordChangeRequest req = dtos.get(0);

        UserMst user = userRepo.findByUserCode(
                req.getUserCode().replace("@muziris", ""));

        user.setPassword(req.getNewPassword());

        return Response.success(user);
    }

    @Override
    protected UserMst saveEntity(
            UserMst entity,
            List<ForgotPasswordChangeRequest> dtos,
            String mode) {

        return userRepo.save(entity);
    }

    @Override
    public ForgotPasswordChangeRequest entityToDto(UserMst entity) {
        // We don't need to return anything to frontend
        // Just prevent framework crash
        return new ForgotPasswordChangeRequest();
    }
}
