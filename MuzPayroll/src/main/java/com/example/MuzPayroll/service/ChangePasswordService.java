package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.ChangePasswordRequest;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class ChangePasswordService
        extends MuzirisAbstractService<ChangePasswordRequest, UserMst> {

    @Autowired
    private UserRepository userRepo;

    // ======================================================
    // PUBLIC API
    // ======================================================
    @Transactional
    public Response<Boolean> changePassword(ChangePasswordRequest request) {

        Response<ChangePasswordRequest> internal = save(List.of(request), "CHANGE_PASSWORD");

        if (!internal.isSuccess()) {
            return Response.error(
                    internal.getErrors().get(0));
        }

        return Response.success(true);
    }

    // ======================================================
    // 1️⃣ ENTITY VALIDATION
    // ======================================================
    @Override
    public Response<Boolean> entityValidate(
            List<ChangePasswordRequest> dtos, String mode) {

        ChangePasswordRequest req = dtos.get(0);

        if (req.getUserCode() == null || req.getUserCode().isBlank())
            return Response.error("User code is required");

        if (req.getCurrentPassword() == null || req.getCurrentPassword().isBlank())
            return Response.error("Current password is required");

        if (req.getNewPassword() == null || req.getNewPassword().isBlank())
            return Response.error("New password is required");

        return Response.success(true);
    }

    // ======================================================
    // 2️⃣ ENTITY POPULATE
    // ======================================================
    @Override
    public Response<Boolean> entityPopulate(
            List<ChangePasswordRequest> dtos, String mode) {

        ChangePasswordRequest req = dtos.get(0);
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
            List<ChangePasswordRequest> dtos, String mode) {

        ChangePasswordRequest req = dtos.get(0);
        UserMst user = req.getUserEntity();

        if (!user.getPassword().equals(req.getCurrentPassword())) {
            return Response.error("Current password is incorrect");
        }

        return Response.success(true);
    }

    // ======================================================
    // 4️⃣ GENERATE PK (NOT REQUIRED)
    // ======================================================
    @Override
    public Response<Object> generatePK(
            List<ChangePasswordRequest> dtos, String mode) {

        return Response.success(true);
    }

    // ======================================================
    // 5️⃣ GENERATE SERIAL NO (NOT REQUIRED)
    // ======================================================
    @Override
    public Response<String> generateSerialNo(
            List<ChangePasswordRequest> dtos, String mode) {

        return Response.success(null);
    }

    // ======================================================
    // 6️⃣ CONVERT TO ENTITY
    // ======================================================
    @Override
    public Response<UserMst> converttoEntity(
            List<ChangePasswordRequest> dtos) {

        ChangePasswordRequest req = dtos.get(0);
        UserMst user = req.getUserEntity();

        user.setPassword(req.getNewPassword());
        user.setUsmPasswordLastChangedDate(LocalDate.now());
        user.setUserAttempt(0);

        return Response.success(user);
    }

    // ======================================================
    // 7️⃣ SAVE ENTITY
    // ======================================================
    @Override
    protected UserMst saveEntity(
            UserMst entity,
            List<ChangePasswordRequest> dtos,
            String mode) {

        return userRepo.save(entity);
    }

    // ======================================================
    // 8️⃣ ENTITY → DTO
    // ======================================================
    @Override
    public ChangePasswordRequest entityToDto(UserMst entity) {

        ChangePasswordRequest dto = new ChangePasswordRequest();
        dto.setMessage("Password changed successfully");
        return dto;
    }
}
