package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpLogDTO;
import com.example.MuzPayroll.entity.DTO.UserGrpMstDTO;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.UserGrpLog;
import com.example.MuzPayroll.entity.UserGrpLogPK;
import com.example.MuzPayroll.entity.UserGrpMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.UserGrpLogRepo;
import com.example.MuzPayroll.repository.UserGrpMstRepo;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class UserGrpMstService extends MuzirisAbstractService<UserGrpMstDTO, UserGrpMst> {

    @Autowired
    private UserGrpMstRepo userGrpMstRepo;

    @Autowired
    private UserGrpLogService userGrpLogService;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGrpLogRepo userGrpLogRepo;

    // ================= FINAL SAVE WRAPPER =================
    @Transactional
    public Response<UserGrpMstDTO> saveWrapper(UserGrpMstDTO dto, String mode) {
        List<UserGrpMstDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        return save(dtos, mode);
    }

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<UserGrpMstDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

            if ("INSERT".equals(mode)) {

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    UserGrpMstDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (isEmpty(dto.getUgmName()))
                        rowErrors.add("Group Name is required");
                    if (isEmpty(dto.getUgmDesc()))
                        rowErrors.add("Desc is required");
                    if (isEmpty(dto.getUgmShortName()))
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
                        if (!isEmpty(dto.getUgmName())) {
                            rowPrefix += " (Location: " + dto.getUgmName() + ")";
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
                    UserGrpMstDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (dto.getUgmUserGroupID() == null)
                        rowErrors.add(("User Id is required"));
                    if (isEmpty(dto.getUgmName()))
                        rowErrors.add("Group Name is required");
                    if (isEmpty(dto.getUgmDesc()))
                        rowErrors.add("Desc is required");
                    if (isEmpty(dto.getUgmShortName()))
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
                        if (!isEmpty(dto.getUgmName())) {
                            rowPrefix += " (Location: " + dto.getUgmName() + ")";
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
        List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityValidate = userGrpLogService.entityValidate(logDtos, mode);

        // If log validation fails, return those errors
        if (!logEntityValidate.isSuccess()) {
            return logEntityValidate;
        }
        // <-----

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<UserGrpMstDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();
        UserGrpMstDTO dto = dtos.get(0);

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

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

            Long mstId = dto.getUgmUserGroupID();
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
        List<UserGrpLogDTO> DtoLogs = populateLogEntityfromEntity(dto);
        dto.setUserGrpLogDTOs(DtoLogs);

        // CALL LogService entityValidate
        List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityPopulate = userGrpLogService.entityPopulate(logDtos, mode);

        // If log entityPopulate fails, return errors
        if (!logEntityPopulate.isSuccess()) {
            return Response.error(logEntityPopulate.getErrors());
        }
        // <-----

        return Response.success(true);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<UserGrpMstDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            if (!errors.isEmpty()) {
                return Response.error(errors);
            }

            // if log table present ---->

            List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Boolean> logbusinessValidate = userGrpLogService.businessValidate(logDtos, mode);

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
    public Response<Object> generatePK(List<UserGrpMstDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("No location data provided");
        }

        try {
            if ("INSERT".equals(mode)) {

                // Process each DTO in the list
                for (UserGrpMstDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    Long transID = dto.getUgmUserGroupID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (transID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = userGrpMstRepo.existsById(transID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = transID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("User ID " + transID + " does not exist in database");
                            continue;
                        }

                    }
                    // ID IS NOT PROVIDED IN DTO (null)
                    else {
                        // Find maximum ID from database
                        Long maxId = userGrpMstRepo.findMaxUgmUserGroupID();

                        if (maxId == null) {
                            // No data in DB - start from 100000
                            generatedId = 1100011L;
                        } else {
                            // Data exists - get latest data and increment
                            generatedId = maxId + 1;

                            if (generatedId > 399999L) {
                                errors.add("Cannot generate ID. Maximum limit (399999) reached for Location: " +
                                        (dto.getUgmName() != null ? dto.getUgmName() : "Unknown"));
                                continue;
                            }
                        }

                        dto.setUgmUserGroupID(generatedId);

                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = userGrpLogService.getMaxRowNo(transID);

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
                for (UserGrpMstDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    Long transID = dto.getUgmUserGroupID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (transID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = userGrpMstRepo.existsById(transID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = transID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("UserGrp ID " + transID + " does not exist in database");
                            continue;
                        }

                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = userGrpLogService.getMaxRowNo(transID);

                        Long mstId = dto.getUgmUserGroupID();
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
            List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Object> logGeneratePK = userGrpLogService.generatePK(logDtos, mode);

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
    public Response<String> generateSerialNo(List<UserGrpMstDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        UserGrpMstDTO dto = dtos.get(0);

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

        List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<String> loggenerateSerialNo = userGrpLogService.generateSerialNo(logDtos, mode);
        dto.setAmendNo(loggenerateSerialNo.getData());

        if (!loggenerateSerialNo.isSuccess()) {
            // Return log service's error
            return loggenerateSerialNo;
        }
        // <-----

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        return Response.success(dto.getUgmCode());

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
    public Response<UserGrpMst> converttoEntity(List<UserGrpMstDTO> dtos) {

        // ===== CREATE ENTITY =====
        UserGrpMst entity = dtoToEntity(dtos);

        // if log table present ---->
        List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
        Response<UserGrpLog> logconverttoEntity = userGrpLogService.converttoEntity(logDtos);

        if (!logconverttoEntity.isSuccess()) {
            return Response.error("Location Log Dto is not converted");
        }
        // <-----

        return Response.success(entity);

    }

    // =================== DTO → ENTITY ===================
    @Override
    protected UserGrpMst dtoToEntity(List<UserGrpMstDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }

        // Take the first DTO from the list
        UserGrpMstDTO dto = dtos.get(0);

        UserGrpMst entity = new UserGrpMst();

        // Set ALL fields from the first DTO
        entity.setUgmUserGroupID(dto.getUgmUserGroupID());
        entity.setEntityMst(dto.getEntityMst());
        entity.setUgmCode(dto.getUgmCode());
        entity.setUgmDesc(dto.getUgmDesc());
        entity.setUgmName(dto.getUgmName());
        entity.setUgmShortName(dto.getUgmShortName());
        entity.setWithaffectdate(dto.getWithaffectdate());
        entity.setActiveDate(dto.getActiveDate());
        entity.setUgmActiveYN(dto.getUgmActiveYN());
        entity.setInactiveDate(dto.getInactiveDate());

        // Set authorization if available
        if (dto.getAuthorization() != null) {
            entity.setAuthorization(dto.getAuthorization());
        }

        return entity;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public UserGrpMstDTO entityToDto(UserGrpMst entity) {
        UserGrpMstDTO dto = new UserGrpMstDTO();

        dto.setUgmUserGroupID(entity.getUgmUserGroupID());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setAuthorization(entity.getAuthorization());
        dto.setActiveDate(entity.getActiveDate());
        dto.setInactiveDate(entity.getInactiveDate());
        dto.setEntityMst(entity.getEntityMst());
        dto.setEntityMstID(entity.getEntityMst().getEtmEntityID());
        dto.setUgmCode(entity.getUgmCode());
        dto.setUgmDesc(entity.getUgmDesc());
        dto.setUgmName(entity.getUgmName());
        dto.setUgmShortName(entity.getUgmShortName());
        dto.setUgmActiveYN(entity.getUgmActiveYN());

        // ===== AUTHORIZATION MAPPING =====
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

    // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected UserGrpMst saveEntity(UserGrpMst entity, List<UserGrpMstDTO> dtos, String mode) {
        UserGrpMstDTO dto = dtos.get(0);
        UserGrpMst savedEntity = null;

        if ("INSERT".equalsIgnoreCase(mode)) {
            if (entity != null) {
                // ===== SAVE MAIN FIRST =====
                savedEntity = userGrpMstRepo.save(entity);

                // ===== SAVE AUTHORIZATION WITH ID =====
                // Get the authorization created in entityPopulate
                Authorization auth = entity.getAuthorization();

                // Set the ID
                auth.setMstId(savedEntity.getUgmUserGroupID());

                // Save the authorization
                Authorization savedAuth = authorizationRepository.save(auth);
                // Set authId in DTO before passing to log service
                dto.setUgmAuthInfoID(savedAuth.getAuthId());
            }
        } else if ("UPDATE".equalsIgnoreCase(mode)) {

            if (Boolean.TRUE.equals(dto.getAuthorizationStatus())) {

                // ===== SAVE COMPANY =====
                savedEntity = userGrpMstRepo.save(entity);

                // ===== SAVE AUTHORIZATION =====
                Authorization auth = entity.getAuthorization();
                auth.setMstId(savedEntity.getUgmUserGroupID());
                authorizationRepository.save(auth);
                Authorization savedAuth = authorizationRepository.save(auth);
                dto.setUgmAuthInfoID(savedAuth.getAuthId());

            } else {
                Long mstId = dto.getUgmUserGroupID();

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
                            auth.setMstId(savedEntity.getUgmUserGroupID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setUgmAuthInfoID(savedAuth.getAuthId());
                        } else {
                            // ===== SAVE =====
                            savedEntity = userGrpMstRepo.save(entity);

                            // ===== SAVE AUTHORIZATION =====
                            Authorization auth = entity.getAuthorization();
                            auth.setMstId(savedEntity.getUgmUserGroupID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setUgmAuthInfoID(savedAuth.getAuthId());

                        }
                    }
                } else if (count > 1) {

                    // MORE THAN ONE row exists
                    // No save, return existing entity
                    savedEntity = entity;
                    // ===== SAVE AUTHORIZATION =====
                    Authorization auth = entity.getAuthorization();
                    auth.setMstId(savedEntity.getUgmUserGroupID());
                    authorizationRepository.save(auth);
                    Authorization savedAuth = authorizationRepository.save(auth);
                    dto.setUgmAuthInfoID(savedAuth.getAuthId());
                }

            }

        } else {
            throw new IllegalArgumentException("Invalid mode: " + mode);
        }

        // if log table present --->
        // ===== SAVE LOG =====

        // Create a Log entity first
        UserGrpLog logEntity = new UserGrpLog();

        // Now call saveEntity with the created entity
        List<UserGrpLogDTO> logDtos = convertToLogDTO(dtos);
        UserGrpLog savedLog = userGrpLogService.saveEntity(logEntity, logDtos, mode);

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
        return entityMst.getEtmEntityID() == null ||
                isEmpty(entityMst.getEtmName()) ||
                isEmpty(entityMst.getEtmCode());
    }

    private List<UserGrpLogDTO> populateLogEntityfromEntity(UserGrpMstDTO dto) {
        List<UserGrpLogDTO> DtoLogs = new ArrayList<>();
        UserGrpLogDTO DtoLog = new UserGrpLogDTO();

        DtoLog.setUgmUserGroupID(dto.getUgmUserGroupID());
        DtoLog.setUgmName(dto.getUgmName());
        DtoLog.setUgmCode(dto.getUgmCode());
        DtoLog.setActiveDate(dto.getActiveDate());
        DtoLog.setAmendNo(dto.getAmendNo());
        DtoLog.setUgmShortName(dto.getUgmShortName());
        DtoLog.setUgmDesc(dto.getUgmDesc());
        DtoLog.setAuthorizationDate(dto.getAuthorizationDate());
        DtoLog.setAuthorizationStatus(dto.getAuthorizationStatus());
        DtoLog.setUserGrpLogPK(dto.getUserGrpLogPK());
        DtoLog.setEntityMst(dto.getEntityMst());
        DtoLogs.add(DtoLog);
        return DtoLogs;
    }

    private List<UserGrpLogDTO> convertToLogDTO(List<UserGrpMstDTO> dtos) {

        if (dtos == null || dtos.isEmpty())
            return null;

        List<UserGrpLogDTO> logDtos = new ArrayList<>();

        for (UserGrpMstDTO dto : dtos) {
            if (dto == null) {
                continue; // Skip null DTOs
            }

            UserGrpLogDTO logDto = new UserGrpLogDTO();

            logDto.setUgmUserGroupID(dto.getUgmUserGroupID());
            logDto.setUgmAuthInfoID(dto.getUgmAuthInfoID());
            logDto.setUgmName(dto.getUgmName());
            logDto.setUgmCode(dto.getUgmCode());
            logDto.setUgmShortName(dto.getUgmShortName());
            logDto.setUgmDesc(dto.getUgmDesc());
            logDto.setActiveDate(dto.getActiveDate());
            logDto.setWithaffectdate(dto.getWithaffectdate());
            logDto.setAuthorizationDate(dto.getAuthorizationDate());
            logDto.setAuthorizationStatus(dto.getAuthorizationStatus());
            logDto.setUserCode(dto.getUserCode());
            logDto.setAmendNo(dto.getAmendNo());
            logDto.setUserGrpLogPK(dto.getUserGrpLogPK());
            logDto.setEntityMst(dto.getEntityMst());

            logDtos.add(logDto);
        }
        return logDtos;
    }

    private void populateLogEntityPKfromEntity(Long logPk, Long logRowNo, UserGrpMstDTO entity) {
        for (UserGrpLogDTO entityLog : entity.getUserGrpLogDTOs()) {
            UserGrpLogPK LogPK = new UserGrpLogPK();
            LogPK.setUgmUserGroupID(logPk);
            LogPK.setRowNo(logRowNo);
            entityLog.setUserGrpLogPK(LogPK);
            entity.setUserGrpLogPK(LogPK);
            logRowNo++;
        }

    }

    // To set the Log list in the entity to retrun to ui
    @Transactional(readOnly = true)
    public UserGrpMstDTO getUserGrpWithLogs(@NonNull Long MstID) {

        // Fetch MST row
        UserGrpMst entity = userGrpMstRepo.findById(MstID)
                .orElseThrow(() -> new RuntimeException("User Grp not found"));

        // Convert MST → DTO
        UserGrpMstDTO dto = entityToDto(entity);

        // Fetch ALL logs related to this MST
        List<UserGrpLog> Logs = userGrpLogRepo
                .findByUserGrpLogPK_UgmUserGroupIDOrderByUserGrpLogPK_RowNoDesc(
                        MstID);

        Optional<UserGrpLog> selectedLog = Logs.stream()
                .filter(log -> log.getAuthorization() != null)
                .max(Comparator.comparing(UserGrpLog::getAmendNo))
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
                            .max(Comparator.comparing(UserGrpLog::getAmendNo));
                });

        // Case 3: no TRUE exists → fallback to latest FALSE
        if (!selectedLog.isPresent()) {
            selectedLog = Logs.stream()
                    .filter(log -> log.getAuthorization() != null)
                    .filter(log -> Boolean.FALSE.equals(
                            log.getAuthorization().getAuthorizationStatus()))
                    .max(Comparator.comparing(UserGrpLog::getAmendNo));
        }

        // Apply mapping
        selectedLog.ifPresent(log -> {

            dto.setAmendNo(log.getAmendNo());
            dto.setUgmAuthInfoID(log.getAuthorization().getAuthId());
            dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
            dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());

            if (log.getAuthorization().getUserMst() != null) {
                dto.setUserCode(
                        log.getAuthorization().getUserMst().getUserCode());
            }
        });

        // Convert ALL logs → DTO list
        List<UserGrpLogDTO> logDtos = Logs.stream()
                .map(userGrpLogService::entityToDto)
                .toList();

        // Attach list to MST DTO
        dto.setUserGrpLogDTOs(logDtos);

        return dto;
    }
}
