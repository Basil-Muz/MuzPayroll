package com.example.MuzPayroll.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.AddressInfoLogPK;
import com.example.MuzPayroll.entity.AddressInfoMst;
import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.DTO.EntityLogDTO;
import com.example.MuzPayroll.entity.DTO.EntityMstDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserEntityDTO;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.EntityLog;
import com.example.MuzPayroll.entity.EntityLogPK;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.MenuThemeHdr;
import com.example.MuzPayroll.entity.MuzControlCodes;
import com.example.MuzPayroll.entity.SolutionMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.AddressInfoMstRepository;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.EntityHierarchyInfoRepository;
import com.example.MuzPayroll.repository.EntityLogRepository;
import com.example.MuzPayroll.repository.EntityRepository;
import com.example.MuzPayroll.repository.MenuThemeDtlRepository;
import com.example.MuzPayroll.repository.MenuThemeHdrRepository;
import com.example.MuzPayroll.repository.MuzControlCodesRepository;
import com.example.MuzPayroll.repository.SolutionRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class EntityService extends MuzirisAbstractService<EntityMstDTO, EntityMst> {

        @Autowired
        private EntityRepository entityRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AuthorizationRepository authorizationRepository;

        @Autowired
        private EntityLogService entityLogService;

        @Autowired
        private EntityLogRepository entityLogRepository;

        @Autowired
        private AddressInfoMstRepository addressInfoMstRepository;

        @Autowired
        private EntityHierarchyInfoRepository entityHierarchyInfoRepository;

        @Autowired
        private MuzControlCodesRepository muzControlCodesRepository;

        @Autowired
        private SolutionRepository solutionRepository;

        @Autowired
        private MenuThemeHdrRepository menuThemeHdrRepository;

        @Autowired
        private MenuThemeDtlRepository menuThemeDtlRepository;

        // private static final String UPLOAD_DIR =
        // "/src/main/java/com/example/MuzPayroll/Uploads/Company/";

        private static final String UPLOAD_DIR = "Uploads/company/";

        // Image validation constants
        private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
        private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
                        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp");

        // ================= FINAL SAVE WRAPPER =================
        @Transactional
        public Response<EntityMstDTO> saveWrapper(EntityMstDTO dto, String mode) {
                List<EntityMstDTO> dtos = new ArrayList<>();
                dtos.add(dto);
                return save(dtos, mode);
        }

        // =================== 1️⃣ ENTITY VALIDATION ===================
        @Override
        public Response<Boolean> entityValidate(List<EntityMstDTO> dtos, String mode) {

                if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

                        if (dtos == null || dtos.isEmpty()) {
                                return Response.error("DTO cannot be null or empty");
                        }

                        List<String> errors = new ArrayList<>();
                        boolean hasAnyError = false;

                        if ("INSERT".equals(mode)) {

                                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                                        EntityMstDTO dto = dtos.get(rowIndex);
                                        int rowNumber = rowIndex + 1;

                                        List<String> rowErrors = new ArrayList<>();

                                        // Check if this row (DTO) is null
                                        if (dto == null) {
                                                errors.add("Row " + rowNumber + ": DTO object is null");
                                                hasAnyError = true;
                                                continue; // Skip to next row
                                        }

                                        // Collect ALL errors
                                        if (isEmpty(dto.getEtmName()))
                                                rowErrors.add("Entity name is required");
                                        if (isEmpty(dto.getEtmShortName()))
                                                rowErrors.add("Short name is required");
                                        if (dto.getActiveDate() == null)
                                                rowErrors.add("Active date is required");
                                        if (isEmpty(dto.getAddress()))
                                                rowErrors.add("Address is required");
                                        if (isEmpty(dto.getCountry()))
                                                rowErrors.add("Country is required");
                                        if (isEmpty(dto.getState()))
                                                rowErrors.add("State is required");
                                        if (isEmpty(dto.getDistrict()))
                                                rowErrors.add("District is required");
                                        if (isEmpty(dto.getPlace()))
                                                rowErrors.add("Place is required");
                                        if (isEmpty(dto.getPincode()))
                                                rowErrors.add("Pincode is required");
                                        if (isEmpty(dto.getMobileNumber()))
                                                rowErrors.add("Mobile number is required");
                                        if (isEmpty(dto.getEmail()))
                                                rowErrors.add("Email is required");
                                        if (dto.getWithaffectdate() == null)
                                                rowErrors.add("With affect date is required");
                                        if (dto.getAuthorizationDate() == null)
                                                rowErrors.add("Authorization date is required");
                                        if (dto.getAuthorizationStatus() == null)
                                                rowErrors.add("Authorization status is required");
                                        if (isEmpty(dto.getUserCode()))
                                                rowErrors.add("User code is required");
                                        if (dto.getEtmActiveYN() == null)
                                                rowErrors.add("Active StatusYN is required");
                                        if (dto.getEtmEntityTypeMccID() == null)
                                                rowErrors.add("MccId is required");
                                        if (dto.getEtmCode() == null)
                                                rowErrors.add("Code is required");

                                        MuzControlCodes controlCodes = muzControlCodesRepository
                                                        .findById(dto.getEtmEntityTypeMccID())
                                                        .orElseThrow(() -> new RuntimeException("Invalid ID"));

                                        dto.setMuzControlCodes(controlCodes);

                                        // Add row errors to main error list with row number
                                        if (!rowErrors.isEmpty()) {
                                                hasAnyError = true;

                                                // Create a prefix for this row's errors
                                                String rowPrefix = "Row " + rowNumber;
                                                if (!isEmpty(dto.getEtmName())) {
                                                        rowPrefix += " (Entity: " + dto.getEtmName() + ")";
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
                                        EntityMstDTO dto = dtos.get(rowIndex);
                                        int rowNumber = rowIndex + 1;

                                        List<String> rowErrors = new ArrayList<>();

                                        // Check if this row (DTO) is null
                                        if (dto == null) {
                                                errors.add("Row " + rowNumber + ": DTO object is null");
                                                hasAnyError = true;
                                                continue; // Skip to next row
                                        }

                                        // Collect ALL errors
                                        if (dto.getEtmEntityId() == null)
                                                rowErrors.add("Entity ID is required");
                                        if (isEmpty(dto.getEtmName()))
                                                rowErrors.add("Entity name is required");
                                        if (isEmpty(dto.getEtmShortName()))
                                                rowErrors.add("Short name is required");
                                        if (dto.getActiveDate() == null)
                                                rowErrors.add("Active date is required");
                                        if (isEmpty(dto.getAddress()))
                                                rowErrors.add("Address is required");
                                        if (isEmpty(dto.getCountry()))
                                                rowErrors.add("Country is required");
                                        if (isEmpty(dto.getState()))
                                                rowErrors.add("State is required");
                                        if (isEmpty(dto.getDistrict()))
                                                rowErrors.add("District is required");
                                        if (isEmpty(dto.getPlace()))
                                                rowErrors.add("Place is required");
                                        if (isEmpty(dto.getPincode()))
                                                rowErrors.add("Pincode is required");
                                        if (isEmpty(dto.getMobileNumber()))
                                                rowErrors.add("Mobile number is required");
                                        if (isEmpty(dto.getEmail()))
                                                rowErrors.add("Email is required");
                                        if (dto.getWithaffectdate() == null)
                                                rowErrors.add("With affect date is required");
                                        if (dto.getAuthorizationDate() == null)
                                                rowErrors.add("Authorization date is required");
                                        if (dto.getAuthorizationStatus() == null)
                                                rowErrors.add("Authorization status is required");
                                        if (isEmpty(dto.getUserCode()))
                                                rowErrors.add("User code is required");
                                        if (dto.getEtmActiveYN() == null)
                                                rowErrors.add("Active StatusYN is required");
                                        if (dto.getEtmCode() == null)
                                                rowErrors.add("Code is required");
                                        if (dto.getEtmEntityTypeMccID() == null)
                                                rowErrors.add("MccId is required");

                                        MuzControlCodes controlCodes = muzControlCodesRepository
                                                        .findById(dto.getEtmEntityTypeMccID())
                                                        .orElseThrow(() -> new RuntimeException("Invalid ID"));

                                        dto.setMuzControlCodes(controlCodes);

                                        // Add row errors to main error list with row number
                                        if (!rowErrors.isEmpty()) {
                                                hasAnyError = true;

                                                // Create a prefix for this row's errors
                                                String rowPrefix = "Row " + rowNumber;
                                                if (!isEmpty(dto.getEtmName())) {
                                                        rowPrefix += " (Entity: " + dto.getEtmName() + ")";
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
                List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                Response<Boolean> logEntityValidate = entityLogService.entityValidate(logDtos, mode);

                // If log validation fails, return those errors
                if (!logEntityValidate.isSuccess()) {
                        return logEntityValidate;
                }
                // <-----

                return Response.success(true);
        }

        // =================== 2️⃣ ENTITY POPULATE ===================
        @Override
        public Response<Boolean> entityPopulate(List<EntityMstDTO> dtos, String mode) {

                List<String> errors = new ArrayList<>();
                EntityMstDTO dto = dtos.get(0);

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

                        // ===== CREATE AUTHORIZATION =====
                        AddressInfoMst infoMst = new AddressInfoMst();
                        infoMst.setAddress(dto.getAddress());
                        infoMst.setAddress(dto.getAddress());
                        infoMst.setAddress1(dto.getAddress1());
                        infoMst.setAddress2(dto.getAddress2());
                        infoMst.setCountry(dto.getCountry());
                        infoMst.setState(dto.getState());
                        infoMst.setDistrict(dto.getDistrict());
                        infoMst.setPlace(dto.getPlace());
                        infoMst.setPincode(dto.getPincode());
                        infoMst.setLandlineNumber(dto.getLandlineNumber());
                        infoMst.setMobileNumber(dto.getMobileNumber());
                        infoMst.setEmail(dto.getEmail());
                        infoMst.setDesignation(dto.getDesignation());
                        infoMst.setEmployerName(dto.getEmployerName());
                        infoMst.setEmployerNumber(dto.getEmployerNumber());
                        infoMst.setEmployerEmail(dto.getEmployerEmail());
                        infoMst.setWithaffectdate(dto.getWithaffectdate());
                        infoMst.setAmendNo(dto.getAmendNo());

                        dto.setAddressInfoMst(infoMst);

                        // ===== CREATE EntityHierarchyInfo =====

                        EntityHierarchyInfo entityInfo = new EntityHierarchyInfo();

                        entityInfo.setEhiBusinessGroupID(1L);
                        entityInfo.setEhiParentLedgerID(2L);
                        entityInfo.setEhiSubLedgerID(3L);
                        entityInfo.setCompanyMst(dto.getCompanyMst());
                        entityInfo.setBranchMst(dto.getBranchMst());
                        entityInfo.setMuzControlCodes(dto.getMuzControlCodes());

                        entityInfo.setEhiLevelNo(10L);

                        if (entityInfo.getMuzControlCodes().equals(14L)) {

                                entityInfo.setEhiParentEntityHierarchyID(dto.getCompanyMst());
                        } else if (entityInfo.getMuzControlCodes().equals(15L)) {

                                entityInfo.setEhiParentEntityHierarchyID(dto.getBranchMst());
                        }

                        dto.setEntityHierarchyInfo(entityInfo);

                }

                if ("UPDATE".equals(mode)) {

                        Long mstId = dto.getEtmEntityId();

                        // Get the latest authId for the mstId

                        Long authId = authorizationRepository
                                        .findLatestAuthIdByMstId(mstId)
                                        .orElseThrow(() -> new IllegalStateException(
                                                        "AuthId not found for entity ID " + mstId));

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

                        Long addressId = entityRepository
                                        .findAddressInfoIdByMstId(mstId)
                                        .orElseThrow(() -> new IllegalStateException(
                                                        "AddressInfo not found for entity ID " + mstId));
                        // ===== CREATE AUTHORIZATION =====
                        AddressInfoMst infoMst = new AddressInfoMst();

                        infoMst.setAddressInfoID(addressId);
                        infoMst.setAddress(dto.getAddress());
                        infoMst.setAddress(dto.getAddress());
                        infoMst.setAddress1(dto.getAddress1());
                        infoMst.setAddress2(dto.getAddress2());
                        infoMst.setCountry(dto.getCountry());
                        infoMst.setState(dto.getState());
                        infoMst.setDistrict(dto.getDistrict());
                        infoMst.setPlace(dto.getPlace());
                        infoMst.setPincode(dto.getPincode());
                        infoMst.setLandlineNumber(dto.getLandlineNumber());
                        infoMst.setMobileNumber(dto.getMobileNumber());
                        infoMst.setEmail(dto.getEmail());
                        infoMst.setDesignation(dto.getDesignation());
                        infoMst.setEmployerName(dto.getEmployerName());
                        infoMst.setEmployerNumber(dto.getEmployerNumber());
                        infoMst.setEmployerEmail(dto.getEmployerEmail());
                        infoMst.setWithaffectdate(dto.getWithaffectdate());
                        infoMst.setAmendNo(dto.getAmendNo());

                        dto.setAddressInfoMst(infoMst);

                }

                // if log table present ---->
                // ******* Populate Log Entity *********************
                List<EntityLogDTO> DtoLogs = populateLogEntityfromEntity(dto);
                dto.setEntityLogDTOs(DtoLogs);

                // CALL entityLogService entityValidate
                List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                Response<Boolean> logEntityPopulate = entityLogService.entityPopulate(logDtos, mode);

                // If log entityPopulate fails, return errors
                if (!logEntityPopulate.isSuccess()) {
                        return Response.error(logEntityPopulate.getErrors());
                }
                // <-----

                return Response.success(true);

        }

        // =================== 3️⃣ BUSINESS VALIDATION ===================
        @Override
        public Response<Boolean> businessValidate(List<EntityMstDTO> dtos, String mode) {

                if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
                        EntityMstDTO dto = dtos.get(0);

                        List<String> errors = new ArrayList<>();

                        // ===== IMAGE VALIDATION AND PROCESSING =====
                        Response<String> imageValidationResult = validateAndProcessImage(dto);
                        if (!imageValidationResult.isSuccess()) {
                                errors.addAll(imageValidationResult.getErrors());
                        }

                        // If image was successfully processed, set it in both DTO and entity
                        if (imageValidationResult.isSuccess() && imageValidationResult.getData() != null) {
                                String imagePath = imageValidationResult.getData();

                                // Set in DTO
                                dto.setImagePath(imagePath);
                        }

                        if (!errors.isEmpty()) {
                                return Response.error(errors);
                        }

                        // if log table present ---->

                        List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                        Response<Boolean> logbusinessValidate = entityLogService.businessValidate(logDtos, mode);

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
        public Response<Object> generatePK(List<EntityMstDTO> dtos, String mode) {
                List<String> errors = new ArrayList<>();

                if (dtos == null || dtos.isEmpty()) {
                        return Response.error("No Entity data provided");
                }

                try {

                        if ("INSERT".equals(mode)) {

                                // Process each DTO in the list
                                for (EntityMstDTO dto : dtos) {
                                        if (dto == null) {
                                                errors.add("Null DTO found in list");
                                                continue;
                                        }

                                        Long MstID = dto.getEtmEntityId();
                                        Long generatedId = null;

                                        // ID IS PROVIDED IN DTO
                                        if (MstID != null) {
                                                // Check if this ID exists in database
                                                boolean existsInDB = entityRepository.existsById(MstID);

                                                if (existsInDB) {
                                                        // ID is present in DB
                                                        generatedId = MstID;
                                                } else {
                                                        // ID provided but NOT in DB - RETURN ERROR
                                                        errors.add("Entity ID " + MstID
                                                                        + " does not exist in database");
                                                        continue;
                                                }

                                        }
                                        // ID IS NOT PROVIDED IN DTO (null)
                                        else {
                                                // Find maximum ID from database
                                                Long maxId = entityRepository.findMaxEtmEntityID();

                                                if (maxId == null) {
                                                        // No data in DB - start from 100000
                                                        generatedId = 100000L;
                                                } else {
                                                        // Data exists - get latest data and increment
                                                        generatedId = maxId + 1;

                                                        if (generatedId > 999999L) {
                                                                errors.add("Cannot generate ID. Maximum limit (999999) reached for company: "
                                                                                +
                                                                                (dto.getEtmName() != null
                                                                                                ? dto.getEtmName()
                                                                                                : "Unknown"));
                                                                continue;
                                                        }
                                                }

                                                if (dto.getEtmEntityTypeMccID().equals(13L)) {
                                                        dto.setEhiBusinessGroupID(generatedId);
                                                        dto.setEhiParentLedgerID(dto.getEhiBusinessGroupID() + 1);
                                                        dto.setEhiSubLedgerID(dto.getEhiParentLedgerID() + 1);
                                                        dto.setEtmEntityId(dto.getEhiSubLedgerID() + 1);
                                                } else {
                                                        dto.setEtmEntityId(generatedId);
                                                }

                                        }

                                        // Process log rows for this DTO
                                        if (generatedId != null) {
                                                Long transID = dto.getEtmEntityId();
                                                Long logRowNo = 1L; // Default to 1

                                                // Get max row number for this transaction
                                                Response<Long> responseLogMaxRowNo = entityLogService
                                                                .getMaxRowNo(transID);

                                                if (responseLogMaxRowNo.isSuccess()
                                                                && responseLogMaxRowNo.getData() != null) {
                                                        logRowNo = responseLogMaxRowNo.getData() + 1;
                                                }

                                                dto.setLogRowNo(logRowNo);
                                                // Populate log entity PK
                                                populateLogEntityPKfromEntity(transID, logRowNo, dto);

                                        }
                                }
                        }

                        if ("UPDATE".equals(mode)) {

                                // Process each DTO in the list
                                for (EntityMstDTO dto : dtos) {
                                        if (dto == null) {
                                                errors.add("Null DTO found in list");
                                                continue;
                                        }

                                        Long MstID = dto.getEtmEntityId();
                                        Long generatedId = null;

                                        // ID IS PROVIDED IN DTO
                                        if (MstID != null) {
                                                // Check if this ID exists in database
                                                boolean existsInDB = entityRepository.existsById(MstID);

                                                if (existsInDB) {
                                                        // ID is present in DB
                                                        generatedId = MstID;
                                                } else {
                                                        // ID provided but NOT in DB - RETURN ERROR
                                                        errors.add("Entity ID " + MstID
                                                                        + " does not exist in database");
                                                        continue;
                                                }

                                        }

                                        // Process log rows for this DTO
                                        if (generatedId != null) {
                                                Long transID = generatedId;
                                                Long logRowNo = 1L; // Default to 1

                                                // Get max row number for this transaction
                                                Response<Long> responseLogMaxRowNo = entityLogService
                                                                .getMaxRowNo(transID);

                                                Long mstId = dto.getEtmEntityId();

                                                Long authId = authorizationRepository
                                                                .findLatestAuthIdByMstId(mstId)
                                                                .orElseThrow(() -> new IllegalStateException(
                                                                                "AuthId not found for Entity ID "
                                                                                                + mstId));

                                                Optional<Boolean> status = authorizationRepository
                                                                .findStatusByAuthId(authId);

                                                if (!status.orElse(false)) {
                                                        if (responseLogMaxRowNo.isSuccess()
                                                                        && responseLogMaxRowNo.getData() != null) {
                                                                logRowNo = responseLogMaxRowNo.getData();
                                                        }
                                                } else {
                                                        if (responseLogMaxRowNo.isSuccess()
                                                                        && responseLogMaxRowNo.getData() != null) {
                                                                logRowNo = responseLogMaxRowNo.getData() + 1;
                                                        }
                                                }

                                                dto.setLogRowNo(logRowNo);
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
                        List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                        Response<Object> logGeneratePK = entityLogService.generatePK(logDtos, mode);

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
        public Response<String> generateSerialNo(List<EntityMstDTO> dtos, String mode) {

                List<String> errors = new ArrayList<>();
                EntityMstDTO dto = dtos.get(0);

                // try {
                // if ("INSERT".equals(mode)) {

                // String prefix = "CM";

                // // Generate new code
                // Pageable pageable = PageRequest.of(0, 1);
                // List<EntityMst> result =
                // entityRepository.findLatestEntityWithEMPrefix(pageable);

                // String generatedCode;

                // if (result == null || result.isEmpty()) {
                // generatedCode = prefix + "01";
                // } else {
                // EntityMst latestEntity = result.get(0);
                // String latestCode = latestEntity.getEtmCode();

                // // Extract and increment
                // String numberPart = latestCode.substring(prefix.length());
                // String digits = numberPart.replaceAll("[^0-9]", "");
                // int latestNumber = Integer.parseInt(digits);
                // int nextNumber = latestNumber + 1;

                // // Check limit
                // if (nextNumber > 99) {
                // errors.add("Entity code limit reached (max: CM99)");
                // }

                // generatedCode = prefix + String.format("%02d", nextNumber);
                // }

                // // SET CODE IN BOTH DTO AND ENTITY
                // dto.setEtmCode(generatedCode);
                // }

                // // For UPDATE mode
                // else if ("UPDATE".equals(mode)) {

                // Long MstID = dto.getMstID();

                // String code = entityRepository
                // .findCodeByEtmEntityID(MstID)
                // .orElseThrow(
                // () -> new IllegalStateException(
                // "code not found for MstID "
                // + MstID));

                // // Check format
                // if (!code.startsWith("CM")) {
                // errors.add("Invalid company code format. Must start with 'CM'");
                // }

                // // Check if code already exists
                // Optional<EntityMst> exists = entityRepository.findByEtmCode(code);
                // if (exists.isEmpty() || exists == null) {
                // errors.add("Company code '" + code + "' not exists");
                // }

                // // SET CODE IN DTO
                // dto.setEtmCode(code);
                // }
                // // if log table present ---->

                List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                Response<String> loggenerateSerialNo = entityLogService.generateSerialNo(logDtos, mode);
                dto.setAmendNo(loggenerateSerialNo.getData());

                if (!loggenerateSerialNo.isSuccess()) {
                        // Return log service's error
                        return loggenerateSerialNo;
                }
                // <-----

                if (!errors.isEmpty()) {
                        return Response.error(errors);
                }

                return Response.success(dto.getEtmCode());

                // } catch (Exception e) {
                // e.printStackTrace();
                // // Last resort fallback
                // String fallbackCode = "CM01";
                // dto.setEtmCode(fallbackCode);
                // return Response.success(fallbackCode);
                // }
        }

        // =================== 6️⃣ converttoEntity ===================
        @Override
        public Response<EntityMst> converttoEntity(List<EntityMstDTO> dtos) {

                // ===== CREATE COMPANY ENTITY =====
                EntityMst entity = dtoToEntity(dtos);

                // if log table present ---->
                List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                Response<EntityLog> logconverttoEntity = entityLogService.converttoEntity(logDtos);

                if (!logconverttoEntity.isSuccess()) {
                        return Response.error("Entity Log Dto is not converted");
                }
                // <-----

                return Response.success(entity);

        }

        // =================== DTO → ENTITY ===================
        @Override
        protected EntityMst dtoToEntity(List<EntityMstDTO> dtos) {
                if (dtos == null || dtos.isEmpty()) {
                        return null;
                }

                // Take the first DTO from the list
                EntityMstDTO dto = dtos.get(0);

                EntityMst entity = new EntityMst();
                // AddressInfoMst addressInfo = new AddressInfoMst();

                // Set ALL fields from the first DTO
                entity.setEtmEntityId(dto.getEtmEntityId());
                entity.setEtmCode(dto.getEtmCode());
                entity.setEtmName(dto.getEtmName());
                entity.setEtmShortName(dto.getEtmShortName());
                entity.setActiveDate(dto.getActiveDate());
                entity.setEtmActiveYN(dto.getEtmActiveYN());
                entity.setInactiveDate(dto.getInactiveDate());
                entity.setEntityLogPK(dto.getEntityLogPK());
                entity.setMuzControlCodes(dto.getMuzControlCodes());
                entity.setEtmIntPrefix(dto.getEtmIntPrefix());
                entity.setEtmImage(dto.getImagePath());
                entity.setEtmPrefix(dto.getEtmPrefix());

                // Set image path if already available in DTO
                if (dto.getImagePath() != null) {
                        entity.setEtmImage(dto.getImagePath());
                }

                // Set authorization if available
                if (dto.getAuthorization() != null) {
                        entity.setAuthorization(dto.getAuthorization());
                }

                if (dto.getAddressInfoMst() != null) {
                        entity.setAddressInfoMst(dto.getAddressInfoMst());
                }
                if (dto.getEntityHierarchyInfo() != null) {
                        entity.setEntityHierarchyInfo(dto.getEntityHierarchyInfo());
                }

                return entity;
        }

        // =================== ENTITY → DTO ===================

        @Override
        public EntityMstDTO entityToDto(EntityMst entity) {

                EntityMstDTO dto = new EntityMstDTO();

                dto.setEtmEntityId(entity.getEtmEntityId());
                dto.setEtmCode(entity.getEtmCode());
                dto.setEtmName(entity.getEtmName());
                dto.setEtmShortName(entity.getEtmShortName());
                dto.setEtmActiveYN(entity.getEtmActiveYN());
                dto.setActiveDate(entity.getActiveDate());
                dto.setInactiveDate(entity.getInactiveDate());
                dto.setEtmActiveYN(entity.getEtmActiveYN());
                dto.setEntityLogPK(entity.getEntityLogPK());
                dto.setMuzControlCodes(entity.getMuzControlCodes());
                dto.setEtmIntPrefix(entity.getEtmIntPrefix());
                dto.setImagePath(entity.getEtmImage());
                dto.setEtmPrefix(entity.getEtmPrefix());
                dto.setEtmIntPrefix(entity.getEtmIntPrefix());
                dto.setEtmDocInfoID(entity.getEtmDocInfoID());
                dto.setAmendNo(entity.getAmendNo());
                dto.setEtmEntityTypeMccID(entity.getMuzControlCodes().getMccEntityHierarchyID());

                // ===== AUTHORIZATION MAPPING =====
                if (entity.getAuthorization() != null) {

                        dto.setAuthId(entity.getAuthorization().getAuthId());
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
        protected EntityMst saveEntity(EntityMst entity, List<EntityMstDTO> dtos, String mode) {

                EntityMstDTO dto = dtos.get(0);
                EntityMst savedEntity = null;
                AddressInfoMst saveAddress = null;
                EntityHierarchyInfo saveEntityInfo = null;

                if ("INSERT".equalsIgnoreCase(mode)) {

                        // ===== SAVE Address info =====
                        AddressInfoMst addressInfoMst = entity.getAddressInfoMst();
                        saveAddress = addressInfoMstRepository.save(addressInfoMst);

                        // Set the entire object (NOT the ID)
                        entity.setAddressInfoID(saveAddress);
                        dto.setAddressInfoID(saveAddress.getAddressInfoID());

                        populateAddressPKfromEntity(dto.getAddressInfoID(), dto.getLogRowNo(), dto);

                        // ===== VALIDATION =====
                        if (entity.getAddressInfoID() == null) {
                                throw new RuntimeException("Address Info ID is required");
                        }

                        if (dto.getEtmEntityTypeMccID().equals(13L)) {

                                // =====================
                                // BUSINESS GROUP
                                // =====================
                                EntityMst bg = new EntityMst();
                                bg.setEtmEntityId(dto.getEhiBusinessGroupID()); // your PK logic
                                bg.setEtmName("Business Group - " + dto.getEtmName());
                                bg.setEtmCode(dto.getEtmCode());
                                bg.setEtmShortName(dto.getEtmShortName());
                                bg.setEtmPrefix("BG");
                                bg.setActiveDate(dto.getActiveDate());
                                bg.setMuzControlCodes(findMccById(10L)); // MCC for BG
                                bg.setEtmActiveYN(true);

                                EntityMst savedBG = entityRepository.save(bg);

                                /// SAVE IN MenuThemeHdr
                                MenuThemeHdr hdr1 = menuThemeHdrRepository
                                                .save(createMenuTheme(1L, savedBG.getEtmEntityId()));
                                menuThemeDtlRepository.insertFromTemplate(
                                                hdr1.getMthMenuThemeID(),
                                                1L);

                                MenuThemeHdr hdr2 = menuThemeHdrRepository
                                                .save(createMenuTheme(2L, savedBG.getEtmEntityId()));
                                menuThemeDtlRepository.insertFromTemplate(
                                                hdr2.getMthMenuThemeID(),
                                                2L);
                                // =====================
                                // PARENT LEDGER
                                // =====================
                                EntityMst parent = new EntityMst();
                                parent.setEtmEntityId(dto.getEhiParentLedgerID());
                                parent.setEtmName("Parent Ledger - " + dto.getEtmName());
                                parent.setEtmCode(dto.getEtmCode());
                                parent.setEtmShortName(dto.getEtmShortName());
                                parent.setEtmPrefix("PL");
                                parent.setActiveDate(dto.getActiveDate());
                                parent.setMuzControlCodes(findMccById(11L)); // MCC for Parent
                                parent.setEtmActiveYN(true);

                                EntityMst savedParent = entityRepository.save(parent);

                                // =====================
                                // SUB LEDGER
                                // =====================
                                EntityMst sub = new EntityMst();
                                sub.setEtmEntityId(dto.getEhiSubLedgerID());
                                sub.setEtmName("Sub Ledger - " + dto.getEtmName());
                                sub.setEtmCode(dto.getEtmCode());
                                sub.setEtmShortName(dto.getEtmShortName());
                                sub.setEtmPrefix("SL");
                                sub.setActiveDate(dto.getActiveDate());
                                sub.setMuzControlCodes(findMccById(12L)); // MCC for Sub
                                sub.setEtmActiveYN(true);

                                EntityMst savedSub = entityRepository.save(sub);

                                // =====================
                                // COMPANY
                                // ================UserAndUserGroupLink=====
                                savedEntity = entityRepository.save(entity);

                                // BG hierarchy
                                EntityHierarchyInfo bgHierarchy = new EntityHierarchyInfo();
                                bgHierarchy.setEhiEntityHierarchyID(savedBG);
                                bgHierarchy.setEhiLevelNo(1L);
                                bgHierarchy.setMuzControlCodes(findMccById(10L));
                                bgHierarchy.setEhiBusinessGroupID(savedBG.getEtmEntityId());
                                entityHierarchyInfoRepository.save(bgHierarchy);

                                // Parent hierarchy
                                EntityHierarchyInfo parentHierarchy = new EntityHierarchyInfo();
                                parentHierarchy.setEhiEntityHierarchyID(savedParent);
                                parentHierarchy.setEhiParentEntityHierarchyID(bgHierarchy.getEhiEntityHierarchyID());
                                parentHierarchy.setEhiBusinessGroupID(bgHierarchy.getEhiBusinessGroupID());
                                parentHierarchy.setEhiLevelNo(2L);
                                parentHierarchy.setMuzControlCodes(findMccById(11L));
                                parentHierarchy.setEhiParentLedgerID(savedParent.getEtmEntityId());
                                entityHierarchyInfoRepository.save(parentHierarchy);

                                // Sub hierarchy
                                EntityHierarchyInfo subHierarchy = new EntityHierarchyInfo();
                                subHierarchy.setEhiEntityHierarchyID(savedSub);
                                subHierarchy.setEhiParentEntityHierarchyID(parentHierarchy.getEhiEntityHierarchyID());
                                subHierarchy.setEhiBusinessGroupID(bgHierarchy.getEhiBusinessGroupID());
                                subHierarchy.setEhiParentLedgerID(parentHierarchy.getEhiParentLedgerID());
                                subHierarchy.setEhiLevelNo(3L);
                                subHierarchy.setMuzControlCodes(findMccById(12L));
                                subHierarchy.setEhiSubLedgerID(savedSub.getEtmEntityId());
                                entityHierarchyInfoRepository.save(subHierarchy);

                                // Company hierarchy
                                EntityHierarchyInfo companyHierarchy = new EntityHierarchyInfo();
                                companyHierarchy.setEhiEntityHierarchyID(savedEntity);
                                companyHierarchy.setEhiParentEntityHierarchyID(subHierarchy.getEhiEntityHierarchyID());
                                companyHierarchy.setEhiBusinessGroupID(bgHierarchy.getEhiBusinessGroupID());
                                companyHierarchy.setEhiParentLedgerID(parentHierarchy.getEhiParentLedgerID());
                                companyHierarchy.setEhiSubLedgerID(subHierarchy.getEhiSubLedgerID());
                                // companyHierarchy.setCompanyMst(companyHierarchy.getEhiEntityHierarchyID());
                                companyHierarchy.setCompanyMst(savedEntity);
                                companyHierarchy.setEhiLevelNo(4L);
                                companyHierarchy.setMuzControlCodes(findMccById(13L));
                                entityHierarchyInfoRepository.save(companyHierarchy);

                        } else {

                                savedEntity = entityRepository.save(entity);
                        }
                        // ===== SAVE AUTHORIZATION =====
                        Authorization auth = entity.getAuthorization();
                        auth.setMstId(savedEntity.getEtmEntityId());

                        Authorization savedAuth = authorizationRepository.save(auth);
                        dto.setAuthId(savedAuth.getAuthId());

                        if (dto.getEtmEntityTypeMccID().equals(14L) || dto.getEtmEntityTypeMccID().equals(15L)) {

                                Long companyId = dto.getCompanyMst().getEtmEntityId();

                                EntityHierarchyInfo latest = entityHierarchyInfoRepository
                                                .findLatestHierarchyByCompanyId(companyId)
                                                .orElseThrow(() -> new RuntimeException("Hierarchy not found"));

                                Long bgId = latest.getEhiBusinessGroupID();
                                Long parentId = latest.getEhiParentLedgerID();
                                Long subId = latest.getEhiSubLedgerID();
                                Long nextLevel = latest.getEhiLevelNo() + 1;

                                EntityHierarchyInfo hierarchy = new EntityHierarchyInfo();

                                hierarchy.setEhiBusinessGroupID(bgId);
                                hierarchy.setEhiParentLedgerID(parentId);
                                hierarchy.setEhiSubLedgerID(subId);
                                hierarchy.setEhiLevelNo(nextLevel);

                                if (dto.getEtmEntityTypeMccID().equals(14L)) {

                                        // Branch hierarchy
                                        hierarchy.setEhiEntityHierarchyID(savedEntity);
                                        hierarchy.setEhiParentEntityHierarchyID(dto.getCompanyMst());
                                        hierarchy.setCompanyMst(dto.getCompanyMst());
                                        hierarchy.setEhiLevelNo(4L);
                                        hierarchy.setBranchMst(hierarchy.getEhiEntityHierarchyID());
                                        hierarchy.setMuzControlCodes(findMccById(14L));
                                        entityHierarchyInfoRepository.save(hierarchy);
                                } else if (dto.getEtmEntityTypeMccID().equals(15L)) {

                                        // Location hierarchy
                                        hierarchy.setEhiEntityHierarchyID(savedEntity);
                                        hierarchy.setEhiParentEntityHierarchyID(dto.getBranchMst());
                                        hierarchy.setCompanyMst(dto.getCompanyMst());
                                        hierarchy.setBranchMst(dto.getBranchMst());
                                        hierarchy.setLocationMst(hierarchy.getEhiEntityHierarchyID());
                                        hierarchy.setMuzControlCodes(findMccById(15L));
                                        entityHierarchyInfoRepository.save(hierarchy);
                                }

                        }
                } else if ("UPDATE".equalsIgnoreCase(mode)) {

                        if (Boolean.TRUE.equals(dto.getAuthorizationStatus())) {

                                // ===== SAVE Address info =====
                                AddressInfoMst addressInfoMst = entity.getAddressInfoMst();
                                saveAddress = addressInfoMstRepository.save(addressInfoMst);

                                // Set the entire object (NOT the ID)
                                entity.setAddressInfoID(saveAddress);
                                dto.setAddressInfoID(saveAddress.getAddressInfoID());

                                populateAddressPKfromEntity(dto.getAddressInfoID(), dto.getLogRowNo(), dto);

                                // ===== VALIDATION =====
                                if (entity.getAddressInfoID() == null) {
                                        throw new RuntimeException("Address Info ID is required");
                                }

                                // ===== SAVE ENTITY =====
                                savedEntity = entityRepository.save(entity);

                                // ===== SAVE AUTHORIZATION =====
                                Authorization auth = entity.getAuthorization();
                                auth.setMstId(savedEntity.getEtmEntityId());
                                authorizationRepository.save(auth);
                                Authorization savedAuth = authorizationRepository.save(auth);
                                dto.setAuthId(savedAuth.getAuthId());

                        } else {

                                Long mstId = dto.getEtmEntityId();

                                long count = authorizationRepository.countByMstId(mstId);
                                if (count == 1) {
                                        // Exactly ONE row exists
                                        Optional<Boolean> statusOpt = authorizationRepository.findStatusByMstId(mstId);

                                        if (statusOpt.isPresent()) {
                                                Boolean status = statusOpt.get();

                                                if (Boolean.TRUE.equals(status)) {

                                                        populateAddressPKfromEntity(
                                                                        dto.getAddressInfoMst().getAddressInfoID(),
                                                                        dto.getLogRowNo(), dto);
                                                        AddressInfoMst addressInfoMst = entity.getAddressInfoMst();
                                                        saveAddress = addressInfoMst;
                                                        // No save, return existing entity
                                                        savedEntity = entity;
                                                        // ===== SAVE AUTHORIZATION =====
                                                        Authorization auth = entity.getAuthorization();
                                                        auth.setMstId(savedEntity.getEtmEntityId());
                                                        authorizationRepository.save(auth);
                                                        Authorization savedAuth = authorizationRepository.save(auth);
                                                        dto.setAuthId(savedAuth.getAuthId());
                                                } else if (Boolean.FALSE.equals(status)) {

                                                        // ===== SAVE Address info =====
                                                        AddressInfoMst addressInfoMst = entity.getAddressInfoMst();
                                                        saveAddress = addressInfoMstRepository
                                                                        .save(addressInfoMst);

                                                        // Set the entire object (NOT the ID)
                                                        entity.setAddressInfoID(saveAddress);
                                                        dto.setAddressInfoID(saveAddress.getAddressInfoID());

                                                        populateAddressPKfromEntity(dto.getAddressInfoID(),
                                                                        dto.getLogRowNo(),
                                                                        dto);

                                                        // ===== VALIDATION =====
                                                        if (entity.getAddressInfoID() == null) {
                                                                throw new RuntimeException(
                                                                                "Address Info ID is required");
                                                        }

                                                        // ===== SAVE ENTITY =====
                                                        savedEntity = entityRepository.save(entity);

                                                        // ===== SAVE AUTHORIZATION =====
                                                        Authorization auth = entity.getAuthorization();
                                                        auth.setMstId(savedEntity.getEtmEntityId());
                                                        authorizationRepository.save(auth);
                                                        Authorization savedAuth = authorizationRepository.save(auth);
                                                        dto.setAuthId(savedAuth.getAuthId());

                                                }
                                        }
                                } else if (count > 1) {

                                        populateAddressPKfromEntity(
                                                        dto.getAddressInfoMst().getAddressInfoID(),
                                                        dto.getLogRowNo(), dto);
                                        // MORE THAN ONE row exists
                                        // No save, return existing entity
                                        AddressInfoMst addressInfoMst = entity.getAddressInfoMst();
                                        saveAddress = addressInfoMst;
                                        savedEntity = entity;
                                        // ===== SAVE AUTHORIZATION =====
                                        Authorization auth = entity.getAuthorization();
                                        auth.setMstId(savedEntity.getEtmEntityId());
                                        authorizationRepository.save(auth);
                                        Authorization savedAuth = authorizationRepository.save(auth);
                                        dto.setAuthId(savedAuth.getAuthId());
                                } else if (count < 1) {
                                        throw new IllegalArgumentException("Invalid Entity ID: " + mstId);
                                }

                        }

                } else {
                        throw new IllegalArgumentException("Invalid mode: " + mode);
                }

                // ===== SAVE ENTITY LOG =====
                EntityLog logEntity = new EntityLog();
                List<EntityLogDTO> logDtos = convertToLogDTO(dtos);
                entityLogService.saveEntity(logEntity, logDtos, mode);

                return savedEntity;
        }

        // =================== 9️⃣ UTILITY METHODS ===================

        private boolean isEmpty(String str) {
                return str == null || str.trim().isEmpty();
        }

        private List<EntityLogDTO> populateLogEntityfromEntity(EntityMstDTO dto) {

                List<EntityLogDTO> DtoLogs = new ArrayList<>();
                EntityLogDTO DtoLog = new EntityLogDTO();

                DtoLog.setEtmEntityId(dto.getEtmEntityId());
                DtoLog.setEtmName(dto.getEtmName());
                DtoLog.setEtmCode(dto.getEtmCode());
                DtoLog.setEtmShortName(dto.getEtmShortName());
                DtoLog.setEtmActiveYN(dto.getEtmActiveYN());
                DtoLog.setActiveDate(dto.getActiveDate());
                DtoLog.setWithaffectdate(dto.getWithaffectdate());
                DtoLog.setAddress(dto.getAddress());
                DtoLog.setAddress1(dto.getAddress1());
                DtoLog.setAddress2(dto.getAddress2());
                DtoLog.setCountry(dto.getCountry());
                DtoLog.setState(dto.getState());
                DtoLog.setDistrict(dto.getDistrict());
                DtoLog.setPlace(dto.getPlace());
                DtoLog.setPincode(dto.getPincode());
                DtoLog.setLandlineNumber(dto.getLandlineNumber());
                DtoLog.setMobileNumber(dto.getMobileNumber());
                DtoLog.setEmail(dto.getEmail());
                DtoLog.setEmployerName(dto.getEmployerName());
                DtoLog.setDesignation(dto.getDesignation());
                DtoLog.setEmployerNumber(dto.getEmployerNumber());
                DtoLog.setEmployerEmail(dto.getEmployerEmail());
                DtoLog.setImagePath(dto.getImagePath());
                DtoLog.setAmendNo(dto.getAmendNo());
                DtoLog.setAuthorizationDate(dto.getAuthorizationDate());
                DtoLog.setAuthorizationStatus(dto.getAuthorizationStatus());
                DtoLog.setEntityLogPK(dto.getEntityLogPK());
                DtoLog.setAddressInfoLogPK(dto.getAddressInfoLogPK());
                DtoLog.setAddressInfoID(dto.getAddressInfoID());
                DtoLog.setEtmIntPrefix(dto.getEtmIntPrefix());
                DtoLog.setEtmPrefix(dto.getEtmPrefix());
                DtoLog.setAuthId(dto.getAuthId());
                DtoLog.setMuzControlCodes(dto.getMuzControlCodes());
                DtoLog.setInactiveDate(dto.getInactiveDate());

                DtoLogs.add(DtoLog);
                return DtoLogs;
        }

        private List<EntityLogDTO> convertToLogDTO(List<EntityMstDTO> dtos) {

                if (dtos == null || dtos.isEmpty())
                        return null;

                List<EntityLogDTO> logDtos = new ArrayList<>();

                for (EntityMstDTO dto : dtos) {
                        if (dto == null) {
                                continue; // Skip null DTOs
                        }

                        EntityLogDTO logDto = new EntityLogDTO();

                        logDto.setEtmEntityId(dto.getEtmEntityId());
                        logDto.setAuthId(dto.getAuthId());
                        logDto.setAddressInfoLogPK(dto.getAddressInfoLogPK());
                        logDto.setAddressInfoID(dto.getAddressInfoID());
                        logDto.setEtmCode(dto.getEtmCode());
                        logDto.setEtmName(dto.getEtmName());
                        logDto.setEtmShortName(dto.getEtmShortName());
                        logDto.setEtmActiveYN(dto.getEtmActiveYN());
                        logDto.setAddress(dto.getAddress());
                        logDto.setAddress1(dto.getAddress1());
                        logDto.setAddress2(dto.getAddress2());
                        logDto.setCountry(dto.getCountry());
                        logDto.setState(dto.getState());
                        logDto.setDistrict(dto.getDistrict());
                        logDto.setPlace(dto.getPlace());
                        logDto.setPincode(dto.getPincode());
                        logDto.setLandlineNumber(dto.getLandlineNumber());
                        logDto.setMobileNumber(dto.getMobileNumber());
                        logDto.setEmail(dto.getEmail());
                        logDto.setEmployerName(dto.getEmployerName());
                        logDto.setDesignation(dto.getDesignation());
                        logDto.setEmployerNumber(dto.getEmployerNumber());
                        logDto.setEmployerEmail(dto.getEmployerEmail());
                        logDto.setActiveDate(dto.getActiveDate());
                        logDto.setWithaffectdate(dto.getWithaffectdate());
                        logDto.setAuthorizationDate(dto.getAuthorizationDate());
                        logDto.setAuthorizationStatus(dto.getAuthorizationStatus());
                        logDto.setUserCode(dto.getUserCode());
                        logDto.setImagePath(dto.getImagePath());
                        logDto.setEntityLogPK(dto.getEntityLogPK());
                        logDto.setAmendNo(dto.getAmendNo());
                        logDto.setEtmIntPrefix(dto.getEtmIntPrefix());
                        logDto.setEtmPrefix(dto.getEtmPrefix());
                        logDto.setMuzControlCodes(dto.getMuzControlCodes());
                        logDto.setInactiveDate(dto.getInactiveDate());
                        logDtos.add(logDto);
                }
                return logDtos;
        }

        // =================== 🔟 IMAGE VALIDATION AND PROCESSING ===================
        private Response<String> validateAndProcessImage(EntityMstDTO dto) {
                MultipartFile file = dto.getEtmImage();

                // If no new image uploaded and no existing image path, image is required
                if ((file == null || file.isEmpty()) && isEmpty(dto.getImagePath())) {
                        return Response.error("Entity image is required");
                }

                // If new image is uploaded, validate and process it
                if (file != null && !file.isEmpty()) {

                        // Validate image file
                        List<String> imageErrors = validateImageFile(file);
                        if (!imageErrors.isEmpty()) {
                                String errorMessage = String.join("; ", imageErrors);
                                return Response.error(errorMessage);
                        }

                        // Save the image and get the path
                        try {
                                String imagePath = saveImageFile(file);
                                return Response.success(imagePath);

                        } catch (IOException e) {
                                return Response.error("Failed to save entity image: " + e.getMessage());
                        }
                }

                return Response.success(null);
        }

        // Validate image file
        private List<String> validateImageFile(MultipartFile file) {
                List<String> errors = new ArrayList<>();

                if (file == null || file.isEmpty()) {
                        errors.add("Image file is empty");
                        return errors;
                }

                // Check file size
                long fileSize = file.getSize();
                if (fileSize > MAX_IMAGE_SIZE) {
                        errors.add("Entity image size must be less than 5MB. Current size: " +
                                        formatFileSize(fileSize));
                }

                // Check file type
                String contentType = file.getContentType();
                String originalFilename = file.getOriginalFilename();

                if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                        // Also check by file extension as fallback
                        if (originalFilename != null) {
                                String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1)
                                                .toLowerCase();
                                if (!isValidImageExtension(extension)) {
                                        errors.add("Invalid image format. Allowed formats: JPEG, JPG, PNG, GIF, BMP, WEBP");
                                }
                        } else {
                                errors.add("Invalid image format. Allowed formats: JPEG, JPG, PNG, GIF, BMP, WEBP");
                        }
                }

                // Check filename for security
                if (originalFilename != null) {
                        if (originalFilename.contains("..") || originalFilename.contains("/")
                                        || originalFilename.contains("\\")) {
                                errors.add("Invalid filename");
                        }
                }

                return errors;
        }

        // Save image file to disk
        private String saveImageFile(MultipartFile file) throws IOException {

                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                }

                String originalFilename = file.getOriginalFilename();
                String extension = "";

                if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                String filename = UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(filename);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // RETURN ONLY RELATIVE URL PATH
                return "/uploads/company/" + filename;
        }

        // Check if file extension is valid
        private boolean isValidImageExtension(String extension) {
                if (extension == null)
                        return false;

                String lowerExt = extension.toLowerCase();
                return lowerExt.equals("jpg") ||
                                lowerExt.equals("jpeg") ||
                                lowerExt.equals("png") ||
                                lowerExt.equals("gif") ||
                                lowerExt.equals("bmp") ||
                                lowerExt.equals("webp");
        }

        // Format file size for human readable display
        private String formatFileSize(long size) {
                if (size < 1024) {
                        return size + " bytes";
                } else if (size < 1024 * 1024) {
                        return String.format("%.1f KB", size / 1024.0);
                } else {
                        return String.format("%.1f MB", size / (1024.0 * 1024.0));
                }
        }

        private MuzControlCodes findMccById(Long id) {
                return muzControlCodesRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("MCC ID not found: " + id));
        }

        private SolutionMst findSolutionById(Long id) {
                return solutionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Solution ID not found: " + id));
        }

        private MenuThemeHdr createMenuTheme(Long solutionId, Long entityId) {
                MenuThemeHdr hdr = new MenuThemeHdr();
                hdr.setMthEntityHierarchyID(entityId);
                hdr.setMthMenuThemeCode("MENU");
                hdr.setMthMenuThemeName("MENU");
                hdr.setMthSystemDefined(1L);
                hdr.setMthTransValidYN(true);
                hdr.setSolutionEntity(findSolutionById(solutionId));
                hdr.setMthAuthInfoID(0L);
                return hdr;
        }

        // To set LogEntityPK from Entity
        private void populateLogEntityPKfromEntity(Long logPk, Long logRowNo, EntityMstDTO entity) {

                for (EntityLogDTO entityLog : entity.getEntityLogDTOs()) {
                        EntityLogPK entityLogPK = new EntityLogPK();
                        entityLogPK.setEtmEntityID(logPk);
                        entityLogPK.setRowNo(logRowNo);
                        entityLog.setEntityLogPK(entityLogPK);
                        entity.setEntityLogPK(entityLogPK);
                        logRowNo++;
                }

        }

        private void populateAddressPKfromEntity(Long logPk, Long logRowNo, EntityMstDTO entity) {

                for (EntityLogDTO entityLog : entity.getEntityLogDTOs()) {
                        AddressInfoLogPK LogPK = new AddressInfoLogPK();
                        LogPK.setAddressInfoID(logPk);
                        LogPK.setRowNo(logRowNo);
                        entityLog.setAddressInfoLogPK(LogPK);
                        entity.setAddressInfoLogPK(LogPK);
                        logRowNo++;
                }
                System.out.println("addres ID  " + entity.getAddressInfoLogPK());
        }

        // To set the Log list in the entity to retrun to ui
        @Transactional(readOnly = true)
        public EntityMstDTO getEntityWithLogs(Long MstID) {

                // Fetch MST row
                EntityMst entity = entityRepository.findById(MstID)
                                .orElseThrow(() -> new RuntimeException("Entity not found"));

                // Convert MST → DTO
                EntityMstDTO dto = entityToDto(entity);

                // Fetch ALL logs related to this MST
                List<EntityLog> entityLogs = entityLogRepository
                                .findAllEntityLogs(
                                                MstID);
                Optional<EntityLog> selectedLog = entityLogs.stream()
                                .filter(log -> log.getAuthorization() != null)
                                .max(Comparator.comparing(EntityLog::getAmendNo))
                                .flatMap(latestLog -> {

                                        // Case 1: latest is TRUE → return it
                                        if (Boolean.TRUE.equals(
                                                        latestLog.getAuthorization().getAuthorizationStatus())) {
                                                return Optional.of(latestLog);
                                        }

                                        // Case 2: latest is FALSE → find latest TRUE
                                        return entityLogs.stream()
                                                        .filter(log -> log.getAuthorization() != null)
                                                        .filter(log -> Boolean.TRUE.equals(
                                                                        log.getAuthorization()
                                                                                        .getAuthorizationStatus()))
                                                        .max(Comparator.comparing(EntityLog::getAmendNo));
                                });

                // Case 3: no TRUE exists → fallback to latest FALSE
                if (!selectedLog.isPresent()) {
                        selectedLog = entityLogs.stream()
                                        .filter(log -> log.getAuthorization() != null)
                                        .filter(log -> Boolean.FALSE.equals(
                                                        log.getAuthorization().getAuthorizationStatus()))
                                        .max(Comparator.comparing(EntityLog::getAmendNo));
                }

                // Apply mapping
                selectedLog.ifPresent(log -> {

                        dto.setAmendNo(log.getAmendNo());
                        dto.setAuthId(log.getAuthorization().getAuthId());
                        dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
                        dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());

                        if (log.getAuthorization().getUserMst() != null) {
                                dto.setUserCode(
                                                log.getAuthorization().getUserMst().getUserCode());
                        }

                        dto.setAddressInfoLogPK(log.getAddressInfoLog().getAddressInfoLogPK());
                        dto.setAddress(log.getAddressInfoLog().getAddress());
                        dto.setAddress1(log.getAddressInfoLog().getAddress1());
                        dto.setAddress2(log.getAddressInfoLog().getAddress2());
                        dto.setCountry(log.getAddressInfoLog().getCountry());
                        dto.setState(log.getAddressInfoLog().getState());
                        dto.setDistrict(log.getAddressInfoLog().getDistrict());
                        dto.setPlace(log.getAddressInfoLog().getPlace());
                        dto.setPincode(log.getAddressInfoLog().getPincode());
                        dto.setLandlineNumber(log.getAddressInfoLog().getLandlineNumber());
                        dto.setMobileNumber(log.getAddressInfoLog().getMobileNumber());
                        dto.setEmail(log.getAddressInfoLog().getEmail());
                        dto.setDesignation(log.getAddressInfoLog().getDesignation());
                        dto.setEmployerName(log.getAddressInfoLog().getEmployerName());
                        dto.setEmployerNumber(log.getAddressInfoLog().getEmployerNumber());
                        dto.setEmployerEmail(log.getAddressInfoLog().getEmployerEmail());
                        dto.setWithaffectdate(log.getAddressInfoLog().getWithaffectdate());
                        dto.setAmendNo(log.getAddressInfoLog().getAmendNo());
                });

                // Convert ALL logs → DTO list
                List<EntityLogDTO> logDtos = entityLogs.stream()
                                .map(entityLogService::entityToDto)
                                .toList();

                // Attach list to MST DTO
                dto.setEntityLogDTOs(logDtos);

                return dto;
        }

        public List<UserEntityDTO> getCompany(Long userMstID, Long mccId) {

                System.out.println("Userid" + userMstID);
                UserMst user = userRepository.findByUserMstID(userMstID)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Long userType = user.getUserTypeMst().getUgmUserGroupID();

                List<Object[]> rows;

                if (userType == 100011) {
                        rows = entityRepository.getAdminCompany(mccId);
                } else {
                        rows = entityRepository.getUserCompany(userMstID, mccId);
                }
                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }

        public List<UserEntityDTO> getUserBranch(Long userId, Long companyId, Long mccId) {
                UserMst user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Long userType = user.getUserTypeMst().getUgmUserGroupID();

                List<Object[]> rows;

                if (userType == 100011 || userType == 100012) {
                        rows = entityRepository.getAdminBranch(companyId, mccId);
                } else {
                        rows = entityRepository.getUserBranch(userId, companyId, mccId);
                }

                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }

        public List<UserEntityDTO> getUserLocation(Long userId, Long companyId, Long branchId, Long mccId) {
                UserMst user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Long userType = user.getUserTypeMst().getUgmUserGroupID();

                List<Object[]> rows;

                if (userType == 100011 || userType == 100012) {
                        rows = entityRepository.getAdminLocation(companyId, branchId, mccId);
                } else {
                        rows = entityRepository.getUserLocation(userId, branchId, mccId);
                }

                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }

}