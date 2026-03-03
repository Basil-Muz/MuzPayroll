package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.EntityRightsGrpLog;
import com.example.MuzPayroll.entity.UserGrpLog;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpLogDTO;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.EntityHierarchyInfoRepository;
import com.example.MuzPayroll.repository.EntityRightsGrpLogRepo;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class EntityRightsGrpLogService extends MuzirisAbstractService<EntityRightsGrpLogDTO, EntityRightsGrpLog>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityRightsGrpLogRepo entityRightsGrpLogRepo;

    @Autowired
    private AuthorizationRepository authorizationRepository;
   
    @Autowired
    private EntityHierarchyInfoRepository entityHierarchyInfoRepository;

    @Override
    public Response<Boolean> entityValidate(List<EntityRightsGrpLogDTO> dtos, String mode) {
           // =================== 1️⃣ ENTITY VALIDATION ===================
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
    public Response<Boolean> entityPopulate(List<EntityRightsGrpLogDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            EntityRightsGrpLogDTO dto = dtos.get(0);

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
    public Response<Boolean> businessValidate(List<EntityRightsGrpLogDTO> dtos, String mode) {
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
    public Response<Object> generatePK(List<EntityRightsGrpLogDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
        }
        return Response.success(true);
    }

     // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<EntityRightsGrpLogDTO> dtos, String mode) {
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
        EntityRightsGrpLogDTO dto = dtos.get(0);
        Long generatedAmendNo;

        if ("INSERT".equalsIgnoreCase(mode)) {

            generatedAmendNo = 1L;
        } else {

            Long MstID = dto.getErmEntityRightsGroupID();
            Long latestAmendNo = entityRightsGrpLogRepo
                    .findLatestAmendNoByEntityRightsGroupID(MstID)
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
    public Response<EntityRightsGrpLog> converttoEntity(List<EntityRightsGrpLogDTO> dto) {

        // ===== CREATE ENTITY =====
        EntityRightsGrpLog entity = dtoToEntity(dto);
        return Response.success(entity);
    }

    // =================== DTO → ENTITY ===================
    @Override
    protected EntityRightsGrpLog dtoToEntity(List<EntityRightsGrpLogDTO> dtos) {
        EntityRightsGrpLogDTO dto = dtos.get(0);

        EntityRightsGrpLog log = new EntityRightsGrpLog();

        // Set ALL fields

        log.setEntityRightsGrpLogPK(dto.getEntityRightsGrpLogPK());
       
        if (dto.getEntityHierarchyInfoID() != null) {
            EntityHierarchyInfo hierarchy =
                entityHierarchyInfoRepository.findById(
                        dto.getEntityHierarchyInfoID()
                ).orElseThrow(() ->
                        new RuntimeException("Hierarchy not found"));

            log.setEntityHierarchyInfoID(hierarchy);
        }
        log.setErmCode(dto.getErmCode());
        log.setErmDesc(dto.getErmDesc());
        log.setErmName(dto.getErmName());
        log.setErmShortName(dto.getErmShortName());
        log.setAmendNo(dto.getAmendNo());
        log.setAuthorization(dto.getAuthorization());
        log.setActiveDate(dto.getActiveDate());
        log.setWithaffectdate(dto.getWithaffectdate());
        // log.setErmEntityRightsGroupID(dto.getErmEntityRightsGroupID());
        return log;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public EntityRightsGrpLogDTO entityToDto(EntityRightsGrpLog entity) {

        EntityRightsGrpLogDTO dto = new EntityRightsGrpLogDTO();

        dto.setEntityRightsGrpLogPK(entity.getEntityRightsGrpLogPK());
       
        if (entity.getEntityHierarchyInfoID() != null) {
            dto.setEntityHierarchyInfoID(
                entity.getEntityHierarchyInfoID().getInfoID()
            );
        }
        dto.setErmCode(entity.getErmCode());
        dto.setErmDesc(entity.getErmDesc());
        dto.setErmName(entity.getErmName());
        dto.setErmShortName(entity.getErmShortName());
        dto.setAmendNo(entity.getAmendNo());
        dto.setAuthorization(entity.getAuthorization());
        dto.setActiveDate(entity.getActiveDate());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setErmEntityRightsGroupID(entity.getEntityRightsGrpLogPK().getErmEntityRightsGroupID());

        if (entity.getAuthorization() != null) {
            dto.setErmAuthInfoID(entity.getAuthorization().getAuthId());
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
    protected EntityRightsGrpLog saveEntity(EntityRightsGrpLog log, List<EntityRightsGrpLogDTO> dtos, String mode) {
        EntityRightsGrpLogDTO dto = dtos.get(0);
        EntityRightsGrpLog savedLog = null;
        if ("INSERT".equalsIgnoreCase(mode) || "UPDATE".equalsIgnoreCase(mode)) {

            log.setErmName(dto.getErmName());
            if (dto.getEntityHierarchyInfoID() != null) {
            EntityHierarchyInfo hierarchy =
                entityHierarchyInfoRepository.findById(
                        dto.getEntityHierarchyInfoID()
                ).orElseThrow(() ->
                        new RuntimeException("Hierarchy not found"));

            log.setEntityHierarchyInfoID(hierarchy);
        }
            log.setActiveDate(dto.getActiveDate());
            log.setWithaffectdate(dto.getWithaffectdate());
            log.setAmendNo(dto.getAmendNo());
            log.setErmCode(dto.getErmCode());
            log.setErmShortName(dto.getErmShortName());
            log.setErmDesc(dto.getErmDesc());
            log.setEntityRightsGrpLogPK(dto.getEntityRightsGrpLogPK());

            // SET AUTHORIZATION
            if (dto.getErmAuthInfoID() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getErmAuthInfoID());
                auth.setAuthorizationDate(dto.getAuthorizationDate());
                auth.setAuthorizationStatus(dto.getAuthorizationStatus());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for LoctionLog");
            }

            // SAVE TO DATABASE
            savedLog = entityRightsGrpLogRepo.save(log);
        }
        return savedLog;

    }

    public Response<Long> getMaxRowNo(Long ErmEntityRightsGroupID) {

        Long maxRowNo = entityRightsGrpLogRepo.findMaxRowNo(ErmEntityRightsGroupID);

        return Response.success(maxRowNo == null ? 0L : maxRowNo);
    }

}
    
