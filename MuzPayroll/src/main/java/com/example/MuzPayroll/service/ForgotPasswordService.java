package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordRequest;
import com.example.MuzPayroll.entity.DTO.ForgotPasswordResponse;
// import com.example.MuzPayroll.entity.DTO.ForgotPasswordResponse;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class ForgotPasswordService
        extends MuzirisAbstractService<ForgotPasswordRequest, UserMst> {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService;

    // ======================================================
    // PUBLIC API
    // ======================================================
    @Transactional
    public Response<ForgotPasswordResponse> forgotPassword(
            ForgotPasswordRequest request) {

        Response<ForgotPasswordRequest> internal = save(List.of(request), "FORGOT_PASSWORD");

        if (!internal.isSuccess()) {
            return Response.error(
                    internal.getErrors().get(0));
        }

        ForgotPasswordResponse resp = new ForgotPasswordResponse();
        resp.setSuccess(true);
        resp.setMessage("Password sent to registered email");

        return Response.success(resp);
    }

    // ======================================================
    // 1️⃣ ENTITY VALIDATION
    // ======================================================
    @Override
    public Response<Boolean> entityValidate(
            List<ForgotPasswordRequest> dtos, String mode) {

        ForgotPasswordRequest req = dtos.get(0);

        if (req.getUserCode() == null || req.getUserCode().isBlank()) {
            return Response.error("User code is required");
        }

        return Response.success(true);
    }

    // ======================================================
    // 2️⃣ ENTITY POPULATE
    // ======================================================
    @Override
    public Response<Boolean> entityPopulate(
            List<ForgotPasswordRequest> dtos, String mode) {

        ForgotPasswordRequest req = dtos.get(0);
        String userCode = req.getUserCode().replace("@muziris", "");

        UserMst user = userRepo.findByUserCode(userCode);

        if (user == null) {
            return Response.error("Invalid user code");
        }

        req.setUserEntity(user);
        return Response.success(true);
    }

    // ======================================================
    // 3️⃣ BUSINESS VALIDATION
    // ======================================================
    @Override
    public Response<Boolean> businessValidate(
            List<ForgotPasswordRequest> dtos, String mode) {

        // No additional business rules for now
        return Response.success(true);
    }

    // ======================================================
    // 4️⃣ GENERATE PK (NOT REQUIRED)
    // ======================================================
    @Override
    public Response<Object> generatePK(
            List<ForgotPasswordRequest> dtos, String mode) {

        return Response.success(true);
    }

    // ======================================================
    // 5️⃣ GENERATE SERIAL NO (NOT REQUIRED)
    // ======================================================
    @Override
    public Response<String> generateSerialNo(
            List<ForgotPasswordRequest> dtos, String mode) {

        return Response.success(null);
    }

    // ======================================================
    // 6️⃣ CONVERT TO ENTITY
    // ======================================================
    @Override
    public Response<UserMst> converttoEntity(
            List<ForgotPasswordRequest> dtos) {

        ForgotPasswordRequest req = dtos.get(0);
        UserMst user = req.getUserEntity();

        user.setUserAttempt(0); // reset attempts
        // user.setPassword(...) // if you auto-generate password

        user.setUserAttempt(0);

        // ✅ OPTIONAL: unlock account flag if you have one
        // user.setAccountLocked(false);

        // ✅ OPTIONAL: generate new temp password
        String tempPassword = "Temp@123"; // later replace with random
        user.setPassword(tempPassword);

        // store temp password in request (for printing / email)
        req.setMessage(tempPassword);

        return Response.success(user);
    }

    // ======================================================
    // 7️⃣ SAVE ENTITY
    // ======================================================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected UserMst saveEntity(
            UserMst entity,
            List<ForgotPasswordRequest> dtos,
            String mode) {

        UserMst savedUser = userRepo.save(entity);

        ForgotPasswordRequest req = dtos.get(0);

        // DEV MODE – print email + temp password
        emailService.sendPassword(
                savedUser.getEmail(),
                req.getMessage() // temp password
        );
        return savedUser;
    }

    // ======================================================
    // 8️⃣ ENTITY → DTO
    // ======================================================
    @Override
    public ForgotPasswordRequest entityToDto(UserMst entity) {

        ForgotPasswordRequest dto = new ForgotPasswordRequest();
        dto.setMessage("Password sent to registered email");
        return dto;
    }
}
