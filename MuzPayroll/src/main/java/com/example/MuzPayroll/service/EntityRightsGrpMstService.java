package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.EntityRightsGrpLog;
import com.example.MuzPayroll.entity.EntityGrpRights;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.UserGrpLog;
import com.example.MuzPayroll.entity.UserGrpMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpLogDTO;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpMstDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpLogDTO;
import com.example.MuzPayroll.entity.DTO.UserGrpMstDTO;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.EntityHierarchyInfoRepository;
import com.example.MuzPayroll.repository.EntityRightsGrpLogRepo;
import com.example.MuzPayroll.repository.EntityRightsGrpMstRepo;
import com.example.MuzPayroll.repository.LocationRepository;
import com.example.MuzPayroll.repository.UserRepository;

import jakarta.persistence.Convert;
import jakarta.persistence.EntityManager;

import com.example.MuzPayroll.entity.EntityRightsGrpLogPK;
import com.example.MuzPayroll.entity.EntityRightsGrpMst;

@Service
public class EntityRightsGrpMstService extends MuzirisAbstractService<EntityRightsGrpMstDTO, EntityRightsGrpMst>{
        @Autowired
    private EntityRightsGrpMstRepo entityRightsGrpMstRepo;

    @Autowired
    private EntityRightsGrpLogService entityRightsGrpLogService;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityRightsGrpLogRepo entityRightsGrpLogRepo;

    @Autowired
    private EntityHierarchyInfoRepository entityHierarchyInfoRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public Response<EntityRightsGrpMstDTO> saveWrapper(EntityRightsGrpMstDTO dto, String mode) {
        List<EntityRightsGrpMstDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        return save(dtos, mode);
    }
     // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<EntityRightsGrpMstDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

            if ("INSERT".equals(mode)) {

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    EntityRightsGrpMstDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (isEmpty(dto.getErmName()))
                        rowErrors.add("Group Name is required");
                    if (isEmpty(dto.getErmDesc()))
                        rowErrors.add("Desc is required");
                    if (isEmpty(dto.getErmShortName()))
                        rowErrors.add("Short name is required");
                    if (dto.getActiveDate() == null)
                        rowErrors.add("Active date is required");
                    if (isEmpty(dto.getEntityMst()))
                        rowErrors.add("Enity ID is required");

                    // Add row errors to main error list with row number
                    if (!rowErrors.isEmpty()) {
                        hasAnyError = true;

                        // Create a prefix for this row's errors
                        String rowPrefix = "Row " + rowNumber;
                        if (!isEmpty(dto.getErmName())) {
                            rowPrefix += " (Location: " + dto.getErmName() + ")";
                        }

                        for (String error : rowErrors) {
                            errors.add(rowPrefix + ": " + error);
                        }
                    }
                    // Return result
                    if (hasAnyError) {
                        return Response.error(errors);
                    }
                }
            }

            if ("UPDATE".equals(mode)) {

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    EntityRightsGrpMstDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (dto.getErmEntityRightsGroupID() == null)
                        rowErrors.add(("User user Id is required"));
                    if (isEmpty(dto.getErmName()))
                        rowErrors.add("Group Name is required");
                    if (isEmpty(dto.getErmDesc()))
                        rowErrors.add("Desc is required");
                    if (isEmpty(dto.getErmShortName()))
                        rowErrors.add("Short name is required");
                    if (dto.getActiveDate() == null)
                        rowErrors.add("Active date is required");
                    if (isEmpty(dto.getEntityMst()))
                        rowErrors.add("Enity ID is required");
                    if (dto.getWithaffectdate() == null)
                        rowErrors.add("With affect date is required");
                    if (dto.getAuthorizationDate() == null)
                        rowErrors.add("Authorization date is required");
                    if (dto.getAuthorizationStatus() == null)
                        rowErrors.add("Authorization status is required");
                    if (isEmpty(dto.getUserCode()))
                        rowErrors.add("User code is required");

                    // Add row errors to main error list with row number
                    if (!rowErrors.isEmpty()) {
                        hasAnyError = true;

                        // Create a prefix for this row's errors
                        String rowPrefix = "Row " + rowNumber;
                        if (!isEmpty(dto.getErmName())) {
                            rowPrefix += " (Location: " + dto.getErmName() + ")";
                        }

                        for (String error : rowErrors) {
                            errors.add(rowPrefix + ": " + error);
                        }
                    }
                    // Return result
                    if (hasAnyError) {
                        return Response.error(errors);
                    }
                }

            }
        }
        // if log table present ---->
        List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityValidate = entityRightsGrpLogService.entityValidate(logDtos, mode);

        // If log validation fails, return those errors
        if (!logEntityValidate.isSuccess()) {
            return logEntityValidate;
        }
        // <-----

        return Response.success(true);
    }

    

    private List<EntityRightsGrpLogDTO> convertToLogDTO(List<EntityRightsGrpMstDTO> dtos) {
      if (dtos == null || dtos.isEmpty())
            return null;

        List<EntityRightsGrpLogDTO> logDtos = new ArrayList<>();

        for (EntityRightsGrpMstDTO dto : dtos) {
            if (dto == null) {
                continue; // Skip null DTOs
            }

            EntityRightsGrpLogDTO logDto = new EntityRightsGrpLogDTO();

            logDto.setErmEntityRightsGroupID(dto.getErmEntityRightsGroupID());
            logDto.setErmAuthInfoID(dto.getErmAuthInfoID());
            logDto.setErmName(dto.getErmName());
            logDto.setErmCode(dto.getErmCode());
            logDto.setErmShortName(dto.getErmShortName());
            logDto.setErmDesc(dto.getErmDesc());
            logDto.setActiveDate(dto.getActiveDate());
            logDto.setWithaffectdate(dto.getWithaffectdate());
            logDto.setAuthorizationDate(dto.getAuthorizationDate());
            logDto.setAuthorizationStatus(dto.getAuthorizationStatus());
            logDto.setUserCode(dto.getUserCode());
            logDto.setAmendNo(dto.getAmendNo());
            logDto.setEntityRightsGrpLogPK(dto.getEntityRightsGrpLogPK());
            logDto.setEntityMst(dto.getEntityMst());

            logDtos.add(logDto);
        }
        return logDtos;
    }
        // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<EntityRightsGrpMstDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();
        EntityRightsGrpMstDTO dto = dtos.get(0);

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        // System.out.println("Entityfgvgdfgv"+dto.getEntityMst());
        //Fetching business groupid with entity hierarchy id
Long businessGroupId = entityHierarchyInfoRepository
        .findBusinessGroupIdByEntityHierarchyInfoId(
                dto.getEntityMst().getEtmEntityId()
        )
        .orElseThrow(() -> new RuntimeException("Business Group not found"));

    // Convert ID → Entity
    EntityHierarchyInfo bgRef =
        entityManager.getReference(EntityHierarchyInfo.class, businessGroupId);
        // System.out.println("Entityfgvgdfgv"+bgRef);

    dto.setEntityHierarchyInfoID(bgRef);
        

        if ("INSERT".equals(mode)) {

            // ===== CREATE AUTHORIZATION =====
            Authorization auth = new Authorization();
            auth.setAuthorizationDate(dto.getAuthorizationDate());
            auth.setAuthorizationStatus(dto.getAuthorizationStatus());
            auth.setUserMst(user);
            // Store authorization temporarily
            dto.setAuthorization(auth);
        }

        if ("UPDATE".equals(mode)) {

            Long mstId = dto.getErmEntityRightsGroupID();
            // Get the latest authId for the mstId

            Long authId = authorizationRepository
                    .findLatestAuthIdByMstId(mstId)
                    .orElseThrow(
                            () -> new IllegalStateException("AuthId not found for mstId [entityPopulate]" + mstId));

            Optional<Boolean> status = authorizationRepository.findStatusByAuthId(authId);

            // ===== CREATE AUTHORIZATION =====
            Authorization auth = new Authorization();

            if (!status.orElse(false)) {
                // status is FALSE or NOT PRESENT → reuse existing authId
                auth.setAuthId(authId);
            }

            // common fields
            auth.setAuthorizationDate(dto.getAuthorizationDate());
            auth.setAuthorizationStatus(dto.getAuthorizationStatus());
            auth.setUserMst(user);

            // Store authorization temporarily
            dto.setAuthorization(auth);

        }

        // if log table present ---->
        // ******* Populate Log Entity *********************
        List<EntityRightsGrpLogDTO> DtoLogs = populateLogEntityfromEntity(dto);
        dto.setEntityRightsGrpLogDTOs(DtoLogs);

        // CALL LogService entityValidate
        List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityPopulate = entityRightsGrpLogService.entityPopulate(logDtos, mode);

        // If log entityPopulate fails, return errors
        if (!logEntityPopulate.isSuccess()) {
            return Response.error(logEntityPopulate.getErrors());
        }
        // <-----

        return Response.success(true);
    }
    private List<EntityRightsGrpLogDTO> populateLogEntityfromEntity(EntityRightsGrpMstDTO dto) {
        List<EntityRightsGrpLogDTO> DtoLogs = new ArrayList<>();
        EntityRightsGrpLogDTO DtoLog = new EntityRightsGrpLogDTO();

        DtoLog.setErmEntityRightsGroupID(dto.getErmEntityRightsGroupID());
        DtoLog.setErmName(dto.getErmName());
        DtoLog.setErmCode(dto.getErmCode());
        DtoLog.setActiveDate(dto.getActiveDate());
        DtoLog.setAmendNo(dto.getAmendNo());
        DtoLog.setErmShortName(dto.getErmShortName());
        DtoLog.setErmDesc(dto.getErmDesc());
        DtoLog.setAuthorizationDate(dto.getAuthorizationDate());
        DtoLog.setAuthorizationStatus(dto.getAuthorizationStatus());
        DtoLog.setEntityRightsGrpLogPK(dto.getEntityRightsGrpLogPK());
        DtoLog.setEntityMst(dto.getEntityMst());
        DtoLogs.add(DtoLog);
        return DtoLogs;

    }
     // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<EntityRightsGrpMstDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            if (!errors.isEmpty()) {
                return Response.error(errors);
            }

            // if log table present ---->

            List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Boolean> logbusinessValidate = entityRightsGrpLogService.businessValidate(logDtos, mode);

            // If log businessValidate fails, return errors
            if (!logbusinessValidate.isSuccess()) {
                return Response.error(logbusinessValidate.getErrors());
            }

            // <-----
        }
        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(List<EntityRightsGrpMstDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("No Location Grp data provided");
        }

        try {
            if ("INSERT".equals(mode)) {

                // Process each DTO in the list
                for (EntityRightsGrpMstDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    Long transID = dto.getErmEntityRightsGroupID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (transID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = entityRightsGrpMstRepo.existsById(transID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = transID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("Location ID " + transID + " does not exist in database");
                            continue;
                        }

                    }
                    // ID IS NOT PROVIDED IN DTO (null)
                    else {
                        // Find maximum ID from database
                        Long maxId = entityRightsGrpMstRepo.findMaxErmEntityRightsGroupID();

                        if (maxId == null) {
                            // No data in DB - start from 100000
                            generatedId = 1100011L;
                        } else {
                            // Data exists - get latest data and increment
                            generatedId = maxId + 1;

                            if (generatedId > 399999L) {
                                errors.add("Cannot generate ID. Maximum limit (399999) reached for Location: " +
                                        (dto.getErmName() != null ? dto.getErmName() : "Unknown"));
                                continue;
                            }
                        }

                        dto.setErmEntityRightsGroupID(generatedId);

                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = entityRightsGrpLogService.getMaxRowNo(transID);

                        if (responseLogMaxRowNo.isSuccess() && responseLogMaxRowNo.getData() != null) {
                            logRowNo = responseLogMaxRowNo.getData() + 1;
                        }

                        // Populate log entity PK
                        populateLogEntityPKfromEntity(transID, logRowNo, dto);
                    }

                }
            }
            if ("UPDATE".equals(mode)) {

                // Process each DTO in the list
                for (EntityRightsGrpMstDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    Long transID = dto.getErmEntityRightsGroupID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (transID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = entityRightsGrpMstRepo.existsById(transID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = transID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("LocationGrp ID " + transID + " does not exist in database");
                            continue;
                        }

                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = entityRightsGrpLogService.getMaxRowNo(transID);

                        Long mstId = dto.getErmEntityRightsGroupID();
                        System.out.println("Mstid " + mstId);

                        Long authId = authorizationRepository
                                .findLatestAuthIdByMstId(mstId)
                                .orElseThrow(() -> new IllegalStateException("AuthId not found for mstId " + mstId));

                        Optional<Boolean> status = authorizationRepository.findStatusByAuthId(authId);

                        if (!status.orElse(false)) {
                            if (responseLogMaxRowNo.isSuccess() && responseLogMaxRowNo.getData() != null) {
                                logRowNo = responseLogMaxRowNo.getData();
                            }
                        } else {
                            if (responseLogMaxRowNo.isSuccess() && responseLogMaxRowNo.getData() != null) {
                                logRowNo = responseLogMaxRowNo.getData() + 1;
                            }
                        }

                        // Populate log entity PK
                        populateLogEntityPKfromEntity(transID, logRowNo, dto);
                    }

                }

            }
            // If any errors occurred, return them
            if (!errors.isEmpty()) {
                return Response.error(errors);
            }

            // Process all log DTOs together
            List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Object> logGeneratePK = entityRightsGrpLogService.generatePK(logDtos, mode);

            if (!logGeneratePK.isSuccess()) {
                return logGeneratePK;
            }

            return Response.success(true);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.error("Error generating PK: " + e.getMessage());
        }
    }

     // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<EntityRightsGrpMstDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        EntityRightsGrpMstDTO dto = dtos.get(0);

        // try {
        // if ("INSERT".equals(mode)) {

        // String prefix = "LO";

        // // Generate new code
        // Pageable pageable = PageRequest.of(0, 1);
        // List<UserGrpMst> ResponseData =
        // userGrpMstRepo.findLatestLocationWithLOPrefix(pageable);

        // String generatedCode;

        // if (ResponseData == null || ResponseData.isEmpty()) {
        // generatedCode = prefix + "01";
        // } else {
        // UserGrpMst latestResponse = ResponseData.get(0);
        // String latestCode = latestResponse.getUgmCode();

        // // Extract and increment
        // String numberPart = latestCode.substring(prefix.length());
        // String digits = numberPart.replaceAll("[^0-9]", "");
        // int latestNumber = Integer.parseInt(digits);
        // int nextNumber = latestNumber + 1;

        // // Check limit
        // if (nextNumber > 99) {
        // errors.add("Location code limit reached (max: BR99)");
        // }

        // generatedCode = prefix + String.format("%02d", nextNumber);
        // }

        // // SET CODE IN BOTH DTO AND ENTITY
        // dto.setUgmCode(generatedCode);
        // }
        // // For UPDATE mode
        // else if ("UPDATE".equals(mode)) {

        // Long mstId = dto.getUgmUserGroupID();

        // String code = userGrpMstRepo
        // .findCodeByMstId(mstId)
        // .orElseThrow(
        // () -> new IllegalStateException("code not found for Location " + mstId));

        // // Check format
        // if (!code.startsWith("LO")) {
        // errors.add("Invalid Location code format. Must start with 'BR'");
        // }

        // // Check if code already exists
        // Optional<UserGrpMst> exists = userGrpMstRepo.findByCode(code);
        // if (exists.isEmpty() || exists == null) {
        // errors.add("Location code '" + code + "' not exists");
        // }

        // // SET CODE IN DTO
        // dto.getUgmCode(code);
        // }

        // if log table present ---->

        List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<String> loggenerateSerialNo = entityRightsGrpLogService.generateSerialNo(logDtos, mode);
        dto.setAmendNo(loggenerateSerialNo.getData());

        if (!loggenerateSerialNo.isSuccess()) {
            // Return log service's error
            return loggenerateSerialNo;
        }
        // <-----

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        return Response.success(dto.getErmCode());

        // } catch (Exception e) {
        // e.printStackTrace();
        // // Last resort fallback
        // String fallbackCode = "BR01";
        // dto.getUgmCode(fallbackCode);
        // return Response.success(fallbackCode);
        // }
    }

     // =================== 6️⃣ converttoEntity ===================
    @Override
    public Response<EntityRightsGrpMst> converttoEntity(List<EntityRightsGrpMstDTO> dtos) {

        // ===== CREATE ENTITY =====
        EntityRightsGrpMst entity = dtoToEntity(dtos);

        // if log table present ---->
        List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<EntityRightsGrpLog> logconverttoEntity = entityRightsGrpLogService.converttoEntity(logDtos);

        if (!logconverttoEntity.isSuccess()) {
            return Response.error("Location Log Dto is not converted");
        }
        // <-----

        return Response.success(entity);

    }

    // =================== DTO → ENTITY ===================
    @Override
    protected EntityRightsGrpMst dtoToEntity(List<EntityRightsGrpMstDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }

        // Take the first DTO from the list
        EntityRightsGrpMstDTO dto = dtos.get(0);

        EntityRightsGrpMst entity = new EntityRightsGrpMst();

        // Set ALL fields from the first DTO
        entity.setErmEntityGroupID(dto.getErmEntityRightsGroupID());
        entity.setEntityMst(dto.getEntityMst());
        entity.setErmCode(dto.getErmCode());
        entity.setErmDesc(dto.getErmDesc());
        entity.setErmName(dto.getErmName());
        entity.setErmShortName(dto.getErmShortName());
        entity.setWithaffectdate(dto.getWithaffectdate());
        entity.setActiveDate(dto.getActiveDate());
        entity.setErmActiveYN(dto.getErmActiveYN());
        entity.setInactiveDate(dto.getInactiveDate());

        // Set authorization if available
        if (dto.getAuthorization() != null) {
            entity.setAuthorization(dto.getAuthorization());
        }

        return entity;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public EntityRightsGrpMstDTO entityToDto(EntityRightsGrpMst entity) {
        EntityRightsGrpMstDTO dto = new EntityRightsGrpMstDTO();

        dto.setErmEntityRightsGroupID(entity.getErmEntityGroupID());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setAuthorization(entity.getAuthorization());
        dto.setActiveDate(entity.getActiveDate());
        dto.setInactiveDate(entity.getInactiveDate());
        dto.setEntityMst(entity.getEntityMst());
        // dto.setEntityMstID(entity.getEntityMst().getEtmEntityID());
        dto.setErmCode(entity.getErmCode());
        dto.setErmDesc(entity.getErmDesc());
        dto.setErmName(entity.getErmName());
        dto.setErmShortName(entity.getErmShortName());
        dto.setErmActiveYN(entity.getErmActiveYN());

        // ===== AUTHORIZATION MAPPING =====
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

    // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected EntityRightsGrpMst saveEntity(EntityRightsGrpMst entity, List<EntityRightsGrpMstDTO> dtos, String mode) {
        EntityRightsGrpMstDTO dto = dtos.get(0);
        EntityRightsGrpMst savedEntity = null;

        if ("INSERT".equalsIgnoreCase(mode)) {
            if (entity != null) {
                // ===== SAVE MAIN FIRST =====
                savedEntity = entityRightsGrpMstRepo.save(entity);

                // ===== SAVE AUTHORIZATION WITH ID =====
                // Get the authorization created in entityPopulate
                Authorization auth = entity.getAuthorization();

                // Set the ID
                auth.setMstId(savedEntity.getErmEntityGroupID());

                // Save the authorization
                Authorization savedAuth = authorizationRepository.save(auth);
                // Set authId in DTO before passing to log service
                dto.setErmAuthInfoID(savedAuth.getAuthId());
            }
        } else if ("UPDATE".equalsIgnoreCase(mode)) {

            if (Boolean.TRUE.equals(dto.getAuthorizationStatus())) {

                // ===== SAVE COMPANY =====
                savedEntity = entityRightsGrpMstRepo.save(entity);

                // ===== SAVE AUTHORIZATION =====
                Authorization auth = entity.getAuthorization();
                auth.setMstId(savedEntity.getErmEntityGroupID());
                authorizationRepository.save(auth);
                Authorization savedAuth = authorizationRepository.save(auth);
                dto.setErmAuthInfoID(savedAuth.getAuthId());

            } else {
                Long mstId = dto.getErmEntityRightsGroupID();

                long count = authorizationRepository.countByMstId(mstId);

                if (count == 1) {
                    // Exactly ONE row exists
                    Optional<Boolean> statusOpt = authorizationRepository.findStatusByMstId(mstId);

                    if (statusOpt.isPresent()) {
                        Boolean status = statusOpt.get();

                        if (Boolean.TRUE.equals(status)) {
                            // No save, return existing entity
                            savedEntity = entity;
                            // ===== SAVE AUTHORIZATION =====
                            Authorization auth = entity.getAuthorization();
                            auth.setMstId(savedEntity.getErmEntityGroupID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setErmAuthInfoID(savedAuth.getAuthId());
                        } else {
                            // ===== SAVE =====
                            savedEntity = entityRightsGrpMstRepo.save(entity);

                            // ===== SAVE AUTHORIZATION =====
                            Authorization auth = entity.getAuthorization();
                            auth.setMstId(savedEntity.getErmEntityGroupID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setErmAuthInfoID(savedAuth.getAuthId());

                        }
                    }
                } else if (count > 1) {

                    // MORE THAN ONE row exists
                    // No save, return existing entity
                    savedEntity = entity;
                    // ===== SAVE AUTHORIZATION =====
                    Authorization auth = entity.getAuthorization();
                    auth.setMstId(savedEntity.getErmEntityGroupID());
                    authorizationRepository.save(auth);
                    Authorization savedAuth = authorizationRepository.save(auth);
                    dto.setErmAuthInfoID(savedAuth.getAuthId());
                }

            }

        } else {
            throw new IllegalArgumentException("Invalid mode: " + mode);
        }

        // if log table present --->
        // ===== SAVE LOG =====

        // Create a Log entity first
        EntityRightsGrpLog logEntity = new EntityRightsGrpLog();

        // Now call saveEntity with the created entity
        List<EntityRightsGrpLogDTO> logDtos = convertToLogDTO(dtos);
        EntityRightsGrpLog savedLog = entityRightsGrpLogService.saveEntity(logEntity, logDtos, mode);

        // <------

        return savedEntity;

    }

    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    private boolean isEmpty(EntityMst entityMst) {
        if (entityMst == null)
            return true;
        return entityMst.getEtmEntityId() == null ||
                isEmpty(entityMst.getEtmName()) ||
                isEmpty(entityMst.getEtmCode());
    }
   
    private void populateLogEntityPKfromEntity(Long logPk, Long logRowNo, EntityRightsGrpMstDTO entity) {
       for (EntityRightsGrpLogDTO entityLog : entity.getEntityRightsGrpLogDTOs()) {
            EntityRightsGrpLogPK LogPK = new EntityRightsGrpLogPK();
            LogPK.setErmEntityRightsGroupID(logPk);
            LogPK.setRowNo(logRowNo);
            entityLog.setEntityRightsGrpLogPK(LogPK);
            entity.setEntityRightsGrpLogPK(LogPK);
            logRowNo++;
        }
    }


    // To set the Log list in the entity to retrun to ui
    @Transactional(readOnly = true)
    public EntityRightsGrpMstDTO getEntityRightsGrpWithLogs(@NonNull Long MstID) {

        // Fetch MST row
        EntityRightsGrpMst entity = entityRightsGrpMstRepo.findById(MstID)
                .orElseThrow(() -> new RuntimeException("User Grp not found"));

        // Convert MST → DTO
        EntityRightsGrpMstDTO dto = entityToDto(entity);

        // Fetch ALL logs related to this MST
        List<EntityRightsGrpLog> Logs = entityRightsGrpLogRepo
                .findByEntityRightsGrpLogPK_ErmEntityRightsGroupIDOrderByEntityRightsGrpLogPK_RowNoDesc(
                        MstID);

        Optional<EntityRightsGrpLog> selectedLog = Logs.stream()
                .filter(log -> log.getAuthorization() != null)
                .max(Comparator.comparing(EntityRightsGrpLog::getAmendNo))
                .flatMap(latestLog -> {

                    // Case 1: latest is TRUE → return it
                    if (Boolean.TRUE.equals(
                            latestLog.getAuthorization().getAuthorizationStatus())) {
                        return Optional.of(latestLog);
                    }

                    // Case 2: latest is FALSE → find latest TRUE
                    return Logs.stream()
                            .filter(log -> log.getAuthorization() != null)
                            .filter(log -> Boolean.TRUE.equals(
                                    log.getAuthorization().getAuthorizationStatus()))
                            .max(Comparator.comparing(EntityRightsGrpLog::getAmendNo));
                });

        // Case 3: no TRUE exists → fallback to latest FALSE
        if (!selectedLog.isPresent()) {
            selectedLog = Logs.stream()
                    .filter(log -> log.getAuthorization() != null)
                    .filter(log -> Boolean.FALSE.equals(
                            log.getAuthorization().getAuthorizationStatus()))
                    .max(Comparator.comparing(EntityRightsGrpLog::getAmendNo));
        }

        // Apply mapping
        selectedLog.ifPresent(log -> {

            dto.setAmendNo(log.getAmendNo());
            dto.setErmAuthInfoID(log.getAuthorization().getAuthId());
            dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
            dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());

            if (log.getAuthorization().getUserMst() != null) {
                dto.setUserCode(
                        log.getAuthorization().getUserMst().getUserCode());
            }
        });

        // Convert ALL logs → DTO list
        List<EntityRightsGrpLogDTO> logDtos = Logs.stream()
                .map(entityRightsGrpLogService::entityToDto)
                .toList();

        // Attach list to MST DTO
        dto.setEntityRightsGrpLogDTOs(logDtos);

        return dto;
    }

    @Transactional(readOnly = true)
    public EntityRightsGrpMstDTO getEntityRightsGrpWithAuth(Long ermEntityGroupID) {

        // Fetch MST row
        EntityRightsGrpMst entity = entityRightsGrpMstRepo.findById(ermEntityGroupID)
                .orElseThrow(() -> new RuntimeException("User Grp not found"));

        // Convert MST → DTO
        EntityRightsGrpMstDTO dto = entityToDto(entity);

        // Fetch ALL logs related to this MST
        // List<UserGrpLog> Logs = userGrpLogRepo
        //         .findByUserGrpLogPK_UgmUserGroupIDOrderByUserGrpLogPK_RowNoDesc(
        //                 ugmUserGroupID);

        // Optional<UserGrpLog> selectedLog = Logs.stream()
        //         .filter(log -> log.getAuthorization() != null)
        //         .max(Comparator.comparing(UserGrpLog::getAmendNo))
        //         .flatMap(latestLog -> {

        //             // Case 1: latest is TRUE → return it
        //             if (Boolean.TRUE.equals(
        //                     latestLog.getAuthorization().getAuthorizationStatus())) {
        //                 return Optional.of(latestLog);
        //             }

        //             // Case 2: latest is FALSE → find latest TRUE
        //             return Logs.stream()
        //                     .filter(log -> log.getAuthorization() != null)
        //                     .filter(log -> Boolean.TRUE.equals(
        //                             log.getAuthorization().getAuthorizationStatus()))
        //                     .max(Comparator.comparing(UserGrpLog::getAmendNo));
        //         });

        // // Case 3: no TRUE exists → fallback to latest FALSE
        // if (!selectedLog.isPresent()) {
        //     selectedLog = Logs.stream()
        //             .filter(log -> log.getAuthorization() != null)
        //             .filter(log -> Boolean.FALSE.equals(
        //                     log.getAuthorization().getAuthorizationStatus()))
        //             .max(Comparator.comparing(UserGrpLog::getAmendNo));
        // }

        // // Apply mapping
        // selectedLog.ifPresent(log -> {

        //     dto.setAmendNo(log.getAmendNo());
        //     dto.setUgmAuthInfoID(log.getAuthorization().getAuthId());
        //     dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
        //     dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());

        //     if (log.getAuthorization().getUserMst() != null) {
        //         dto.setUserCode(
        //                 log.getAuthorization().getUserMst().getUserCode());
        //     }
        // });

        // // Convert ALL logs → DTO list
        // List<UserGrpLogDTO> logDtos = Logs.stream()
        //         .map(userGrpLogService::entityToDto)
        //         .toList();

        // // Attach list to MST DTO
        // dto.setUserGrpLogDTOs(logDtos);

        Authorization auth = authorizationRepository
        .findTopByMstIdOrderByAuthIdDesc(ermEntityGroupID)
        .orElse(null);

        // entity.setAuthorization(auth);  

        // System.out.println("Authrization "+ entity.getAuthorization());
          dto.setAuthorizationStatus(auth.getAuthorizationStatus());
        return dto;
    }
}
