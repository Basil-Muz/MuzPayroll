package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpLogDTO;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.UserRepository;
import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.UserGrpLog;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.UserGrpLogRepo;

//
@Service
public class UserGrpLogService extends MuzirisAbstractService<UserGrpLogDTO, UserGrpLog> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGrpLogRepo userGrpLogRepo;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<UserGrpLogDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null)
                return Response.error("DTO cannot be null");
            List<String> errors = new ArrayList<>();

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
        }

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<UserGrpLogDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            UserGrpLogDTO dto = dtos.get(0);

            UserMst user = userRepository.findByUserCode(dto.getUserCode());
            if (user == null)
                errors.add("Invalid user code");

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
        }
        return Response.success(true);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<UserGrpLogDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
        }
        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(List<UserGrpLogDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
        }
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<UserGrpLogDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();

        // ===== VALIDATION =====
        if (dtos == null || dtos.isEmpty()) {
            errors.add("DTO list cannot be empty");
        }

        if (!"INSERT".equalsIgnoreCase(mode) && !"UPDATE".equalsIgnoreCase(mode)) {
            errors.add("Invalid mode: " + mode);
        }
        // Stop if validation failed
        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        // ===== BUSINESS LOGIC =====
        UserGrpLogDTO dto = dtos.get(0);
        Long generatedAmendNo;

        if ("INSERT".equalsIgnoreCase(mode)) {

            generatedAmendNo = 1L;
        } else {

            Long MstID = dto.getUgmUserGroupID();
            Long latestAmendNo = userGrpLogRepo
                    .findLatestAmendNoByMstId(MstID)
                    .orElse(0L);

            Long authId = authorizationRepository
                    .findLatestAuthIdByMstId(MstID)
                    .orElseThrow(() -> new IllegalStateException(
                            "AuthId not found for mstId [Log generateSerialNo]" + MstID));

            Optional<Boolean> status = authorizationRepository.findStatusByAuthId(authId);

            if (!status.orElse(false)) {
                generatedAmendNo = latestAmendNo;

            } else {
                generatedAmendNo = latestAmendNo + 1;

            }

        }

        dto.setAmendNo(String.valueOf(generatedAmendNo));
        return Response.success(dto.getAmendNo());
    }

    // =================== 6️⃣ converttoEntity ===================

    @Override
    public Response<UserGrpLog> converttoEntity(List<UserGrpLogDTO> dto) {

        // ===== CREATE ENTITY =====
        UserGrpLog entity = dtoToEntity(dto);
        return Response.success(entity);
    }

    // =================== DTO → ENTITY ===================
    @Override
    protected UserGrpLog dtoToEntity(List<UserGrpLogDTO> dtos) {
        UserGrpLogDTO dto = dtos.get(0);

        UserGrpLog log = new UserGrpLog();

        // Set ALL fields

        log.setUserGrpLogPK(dto.getUserGrpLogPK());
        log.setEntityMst(dto.getEntityMst());
        log.setUgmCode(dto.getUgmCode());
        log.setUgmDesc(dto.getUgmDesc());
        log.setUgmName(dto.getUgmName());
        log.setUgmShortName(dto.getUgmShortName());
        log.setAmendNo(dto.getAmendNo());
        log.setAuthorization(dto.getAuthorization());
        log.setActiveDate(dto.getActiveDate());
        log.setWithaffectdate(dto.getWithaffectdate());
        log.setUgmUserGroupID(dto.getUgmUserGroupID());
        return log;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public UserGrpLogDTO entityToDto(UserGrpLog entity) {

        UserGrpLogDTO dto = new UserGrpLogDTO();

        dto.setUserGrpLogPK(entity.getUserGrpLogPK());
        dto.setEntityMst(entity.getEntityMst());
        dto.setUgmCode(entity.getUgmCode());
        dto.setUgmDesc(entity.getUgmDesc());
        dto.setUgmName(entity.getUgmName());
        dto.setUgmShortName(entity.getUgmShortName());
        dto.setAmendNo(entity.getAmendNo());
        dto.setAuthorization(entity.getAuthorization());
        dto.setActiveDate(entity.getActiveDate());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setUgmUserGroupID(entity.getUserGrpLogPK().getUgmUserGroupID());

        if (entity.getAuthorization() != null) {
            dto.setUgmAuthInfoID(entity.getAuthorization().getAuthId());
            dto.setAuthorizationStatus(entity.getAuthorization().getAuthorizationStatus());
            dto.setAuthorizationDate(entity.getAuthorization().getAuthorizationDate());

            if (entity.getAuthorization().getUserMst() != null) {
                dto.setUserCode(entity.getAuthorization().getUserMst().getUserCode());
            }
        }

        return dto;
    }

    // =================== SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected UserGrpLog saveEntity(UserGrpLog log, List<UserGrpLogDTO> dtos, String mode) {
        UserGrpLogDTO dto = dtos.get(0);
        UserGrpLog savedLog = null;
        if ("INSERT".equalsIgnoreCase(mode) || "UPDATE".equalsIgnoreCase(mode)) {

            log.setUgmName(dto.getUgmName());
            log.setEntityMst(dto.getEntityMst());
            log.setActiveDate(dto.getActiveDate());
            log.setWithaffectdate(dto.getWithaffectdate());
            log.setAmendNo(dto.getAmendNo());
            log.setUgmCode(dto.getUgmCode());
            log.setUgmShortName(dto.getUgmShortName());
            log.setUgmDesc(dto.getUgmDesc());
            log.setUserGrpLogPK(dto.getUserGrpLogPK());

            // SET AUTHORIZATION
            if (dto.getUgmAuthInfoID() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getUgmAuthInfoID());
                auth.setAuthorizationDate(dto.getAuthorizationDate());
                auth.setAuthorizationStatus(dto.getAuthorizationStatus());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for CompanyLog");
            }

            // SAVE TO DATABASE
            savedLog = userGrpLogRepo.save(log);
        }
        return savedLog;

    }

    public Response<Long> getMaxRowNo(Long UgmUserGroupID) {

        Long maxRowNo = userGrpLogRepo.findMaxRowNo(UgmUserGroupID);

        return Response.success(maxRowNo == null ? 0L : maxRowNo);
    }

}
