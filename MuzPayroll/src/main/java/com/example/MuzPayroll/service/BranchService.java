package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchLog;
import com.example.MuzPayroll.entity.BranchLogPK;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationLog;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.BranchDTO;
import com.example.MuzPayroll.entity.DTO.BranchLogDTO;
import com.example.MuzPayroll.entity.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.DTO.CompanyLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.BranchLogRepository;
import com.example.MuzPayroll.repository.BranchRepository;

import com.example.MuzPayroll.repository.UserRepository;

@Service
public class BranchService extends MuzirisAbstractService<BranchDTO, BranchMst> {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private BranchLogService branchLogService;

    @Autowired  
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchLogRepository branchLogRepository;

    public List<BranchMst> getAllBranchByCompanyId(Long companyId) {
        return branchRepository.findByCompanyEntity_CompanyMstID(companyId);
    }

    // ================= FINAL SAVE WRAPPER =================
    @Transactional
    public Response<BranchDTO> saveWrapper(BranchDTO dto, String mode) {
        List<BranchDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        return save(dtos, mode);
    }

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<BranchDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

            if ("INSERT".equals(mode)) {

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    BranchDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (isEmpty(dto.getBranch()))
                        rowErrors.add("Branch is required");
                    if (isEmpty(dto.getCompanyEntity()))
                        rowErrors.add("Company is required");
                    if (isEmpty(dto.getShortName()))
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

                    // Add row errors to main error list with row number
                    if (!rowErrors.isEmpty()) {
                        hasAnyError = true;

                        // Create a prefix for this row's errors
                        String rowPrefix = "Row " + rowNumber;
                        if (!isEmpty(dto.getBranch())) {
                            rowPrefix += " (Branch: " + dto.getBranch() + ")";
                        }

                        for (String error : rowErrors) {
                            System.out.println("error : " + error);
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
                    BranchDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (dto.getBranchMstID() == null)
                        rowErrors.add("Branch ID is required");
                    if (isEmpty(dto.getBranch()))
                        rowErrors.add("Branch is required");
                    if (isEmpty(dto.getCompanyEntity()))
                        rowErrors.add("Company is required");
                    if (isEmpty(dto.getShortName()))
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

                    // Add row errors to main error list with row number
                    if (!rowErrors.isEmpty()) {
                        hasAnyError = true;

                        // Create a prefix for this row's errors
                        String rowPrefix = "Row " + rowNumber;
                        if (!isEmpty(dto.getBranch())) {
                            rowPrefix += " (Branch: " + dto.getBranch() + ")";
                        }

                        for (String error : rowErrors) {
                            System.out.println("error : " + error);
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
        List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityValidate = branchLogService.entityValidate(logDtos, mode);

        // If log validation fails, return those errors
        if (!logEntityValidate.isSuccess()) {
            return logEntityValidate;
        }
        // <-----

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<BranchDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();
        BranchDTO dto = dtos.get(0);

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

            Long mstId = dto.getBranchMstID();

            // Get the latest authId for the mstId

            Long authId = authorizationRepository
                    .findLatestAuthIdByMstId(mstId)
                    .orElseThrow(() -> new IllegalStateException("AuthId not found for mstId " + mstId));

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
        List<BranchLogDTO> BranchDtoLogs = populateLogEntityfromEntity(dto);
        dto.setBranchDtoLogs(BranchDtoLogs);

        // CALL branchLogService entityValidate
        List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityPopulate = branchLogService.entityPopulate(logDtos, mode);

        // If log entityPopulate fails, return errors
        if (!logEntityPopulate.isSuccess()) {
            return Response.error(logEntityPopulate.getErrors());
        }
        // <-----

        return Response.success(true);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<BranchDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            if (!errors.isEmpty()) {
                return Response.error(errors);
            }

            // if log table present ---->

            List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Boolean> logbusinessValidate = branchLogService.businessValidate(logDtos, mode);

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
    public Response<Object> generatePK(List<BranchDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("No branch data provided");
        }

        try {

            if ("INSERT".equals(mode)) {

                // Process each DTO in the list
                for (BranchDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    // Long branchMstID = dto.getBranchMstID();
                    Long transID = dto.getBranchMstID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (transID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = branchRepository.existsById(transID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = transID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("Branch ID " + transID + " does not exist in database");
                            continue;
                        }

                    }
                    // ID IS NOT PROVIDED IN DTO (null)
                    else {
                        // Find maximum ID from database
                        Long maxId = branchRepository.findMaxBranchMstID();

                        if (maxId == null) {
                            // No data in DB - start from 200000
                            generatedId = 200000L;
                        } else {
                            // Data exists - get latest data and increment
                            generatedId = maxId + 1;

                            if (generatedId > 299999L) {
                                errors.add("Cannot generate ID. Maximum limit (299999L) reached for company: " +
                                        (dto.getBranch() != null ? dto.getBranch() : "Unknown"));
                                continue;
                            }
                        }

                        dto.setBranchMstID(generatedId);
                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = branchLogService.getMaxRowNo(transID);

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
                for (BranchDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    // Long branchMstID = dto.getBranchMstID();
                    Long transID = dto.getBranchMstID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (transID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = branchRepository.existsById(transID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = transID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("Branch ID " + transID + " does not exist in database");
                            continue;
                        }

                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = branchLogService.getMaxRowNo(transID);

                        Long mstId = dto.getBranchMstID();

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
            List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Object> logGeneratePK = branchLogService.generatePK(logDtos, mode);

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
    public Response<String> generateSerialNo(List<BranchDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        BranchDTO dto = dtos.get(0);

        try {

            if ("INSERT".equals(mode)) {

                String prefix = "BR";

                // Generate new code
                Pageable pageable = PageRequest.of(0, 1);
                List<BranchMst> ResponseData = branchRepository.findLatestBranchWithBRPrefix(pageable);

                String generatedCode;

                if (ResponseData == null || ResponseData.isEmpty()) {
                    generatedCode = prefix + "01";
                } else {
                    BranchMst latestResponse = ResponseData.get(0);
                    String latestCode = latestResponse.getCode();

                    // Extract and increment
                    String numberPart = latestCode.substring(prefix.length());
                    String digits = numberPart.replaceAll("[^0-9]", "");
                    int latestNumber = Integer.parseInt(digits);
                    int nextNumber = latestNumber + 1;

                    // Check limit
                    if (nextNumber > 99) {
                        errors.add("Branch code limit reached (max: BR99)");
                    }

                    generatedCode = prefix + String.format("%02d", nextNumber);
                }

                // SET CODE IN BOTH DTO AND ENTITY
                dto.setCode(generatedCode);
            }

            // For UPDATE mode
            else if ("UPDATE".equals(mode)) {

                Long mstId = dto.getBranchMstID();

                String code = branchRepository
                        .findCodeByMstId(mstId)
                        .orElseThrow(
                                () -> new IllegalStateException("code not found for Branch " + mstId));

                // Check format
                if (!code.startsWith("BR")) {
                    errors.add("Invalid company code format. Must start with 'BR'");
                }

                // Check if code already exists
                Optional<BranchMst> exists = branchRepository.findByCode(code);
                if (exists.isEmpty() || exists == null) {
                    errors.add("Branch code '" + code + "' not exists");
                }

                // SET CODE IN DTO
                dto.setCode(code);
            }
            // if log table present ---->

            List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
            Response<String> loggenerateSerialNo = branchLogService.generateSerialNo(logDtos, mode);
            dto.setAmendNo(loggenerateSerialNo.getData());

            if (!loggenerateSerialNo.isSuccess()) {
                // Return log service's error
                return loggenerateSerialNo;
            }
            // <-----

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
            return Response.success(dto.getCode());

        } catch (Exception e) {
            e.printStackTrace();
            // Last resort fallback
            String fallbackCode = "BR01";
            dto.setCode(fallbackCode);
            return Response.success(fallbackCode);
        }
    }

    // =================== 6️⃣ converttoEntity ===================
    @Override
    public Response<BranchMst> converttoEntity(List<BranchDTO> dtos) {

        // ===== CREATE ENTITY =====
        BranchMst entity = dtoToEntity(dtos);

        // if log table present ---->
        List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
        Response<BranchLog> logconverttoEntity = branchLogService.converttoEntity(logDtos);

        if (!logconverttoEntity.isSuccess()) {
            return Response.error("Branch Log Dto is not converted");
        }
        // <-----

        return Response.success(entity);

    }

    // =================== DTO → ENTITY ===================
    @Override
    protected BranchMst dtoToEntity(List<BranchDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }

        // Take the first DTO from the list
        BranchDTO dto = dtos.get(0);

        BranchMst entity = new BranchMst();

        // Set ALL fields from the first DTO
        entity.setBranchMstID(dto.getBranchMstID());
        entity.setBranch(dto.getBranch());
        entity.setCode(dto.getCode());
        entity.setCompanyEntity(dto.getCompanyEntity());
        entity.setShortName(dto.getShortName());
        entity.setActiveDate(dto.getActiveDate());
        entity.setAddress(dto.getAddress());
        entity.setAddress1(dto.getAddress1());
        entity.setAddress2(dto.getAddress2());
        entity.setCountry(dto.getCountry());
        entity.setState(dto.getState());
        entity.setDistrict(dto.getDistrict());
        entity.setPlace(dto.getPlace());
        entity.setPincode(dto.getPincode());
        entity.setLandlineNumber(dto.getLandlineNumber());
        entity.setMobileNumber(dto.getMobileNumber());
        entity.setEmail(dto.getEmail());
        entity.setWithaffectdate(dto.getWithaffectdate());
        entity.setActiveDate(dto.getActiveDate());
        entity.setActiveStatusYN(dto.getActiveStatusYN());
        entity.setInactiveDate(dto.getInactiveDate());

        // Set authorization if available
        if (dto.getAuthorization() != null) {
            entity.setAuthorization(dto.getAuthorization());
        }

        return entity;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public BranchDTO entityToDto(BranchMst entity) {
        BranchDTO dto = new BranchDTO();

        dto.setBranchMstID(entity.getBranchMstID());
        dto.setBranch(entity.getBranch());
        dto.setCode(entity.getCode());
        dto.setCompanyEntity(entity.getCompanyEntity());
        dto.setShortName(entity.getShortName());
        dto.setActiveDate(entity.getActiveDate());
        dto.setAddress(entity.getAddress());
        dto.setAddress1(entity.getAddress1());
        dto.setAddress2(entity.getAddress2());
        dto.setCountry(entity.getCountry());
        dto.setState(entity.getState());
        dto.setDistrict(entity.getDistrict());
        dto.setPlace(entity.getPlace());
        dto.setPincode(entity.getPincode());
        dto.setLandlineNumber(entity.getLandlineNumber());
        dto.setMobileNumber(entity.getMobileNumber());
        dto.setEmail(entity.getEmail());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setAuthorization(entity.getAuthorization());
        dto.setActiveDate(entity.getActiveDate());
        dto.setActiveStatusYN(entity.getActiveStatusYN());
        dto.setInactiveDate(entity.getInactiveDate());

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
    protected BranchMst saveEntity(BranchMst entity, List<BranchDTO> dtos, String mode) {

        BranchDTO dto = dtos.get(0);
        BranchMst savedEntity = null;

        if ("INSERT".equalsIgnoreCase(mode)) {
            // ===== SAVE MAIN FIRST =====
            savedEntity = branchRepository.save(entity);

            // ===== SAVE AUTHORIZATION WITH ID =====
            // Get the authorization created in entityPopulate
            Authorization auth = entity.getAuthorization();

            // Set the ID
            auth.setMstId(savedEntity.getBranchMstID());

            // Save the authorization
            Authorization savedAuth = authorizationRepository.save(auth);
            // Set authId in DTO before passing to log service
            dto.setAuthId(savedAuth.getAuthId());

        } else if ("UPDATE".equalsIgnoreCase(mode)) {

            if (Boolean.TRUE.equals(dto.getAuthorizationStatus())) {

                // ===== SAVE COMPANY =====
                savedEntity = branchRepository.save(entity);

                // ===== SAVE AUTHORIZATION =====
                Authorization auth = entity.getAuthorization();
                auth.setMstId(savedEntity.getBranchMstID());
                authorizationRepository.save(auth);
                Authorization savedAuth = authorizationRepository.save(auth);
                dto.setAuthId(savedAuth.getAuthId());

            } else {
                Long mstId = dto.getBranchMstID();

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
                            auth.setMstId(savedEntity.getBranchMstID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setAuthId(savedAuth.getAuthId());
                        } else {
                            // ===== SAVE =====
                            savedEntity = branchRepository.save(entity);

                            // ===== SAVE AUTHORIZATION =====
                            Authorization auth = entity.getAuthorization();
                            auth.setMstId(savedEntity.getBranchMstID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setAuthId(savedAuth.getAuthId());

                        }
                    }
                } else if (count > 1) {

                    // MORE THAN ONE row exists
                    // No save, return existing entity
                    savedEntity = entity;
                    // ===== SAVE AUTHORIZATION =====
                    Authorization auth = entity.getAuthorization();
                    auth.setMstId(savedEntity.getBranchMstID());
                    authorizationRepository.save(auth);
                    Authorization savedAuth = authorizationRepository.save(auth);
                    dto.setAuthId(savedAuth.getAuthId());
                }

            }

        } else {
            throw new IllegalArgumentException("Invalid mode: " + mode);
        }

        // if log table present --->
        // ===== SAVE LOG =====

        // Create a Log entity first
        BranchLog logEntity = new BranchLog();

        // Now call saveEntity with the created entity
        List<BranchLogDTO> logDtos = convertToLogDTO(dtos);
        BranchLog savedLog = branchLogService.saveEntity(logEntity, logDtos, mode);

        // <------

        return savedEntity;

    }

    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    private boolean isEmpty(CompanyMst company) {
        if (company == null)
            return true;
        return company.getCompanyMstID() == null ||
                isEmpty(company.getCompany()) ||
                isEmpty(company.getCode());
    }

    private List<BranchLogDTO> populateLogEntityfromEntity(BranchDTO dto) {
        List<BranchLogDTO> DtoLogs = new ArrayList<>();
        BranchLogDTO DtoLog = new BranchLogDTO();

        DtoLog.setBranchMstID(dto.getBranchMstID());
        DtoLog.setCompanyEntity(dto.getCompanyEntity());
        DtoLog.setBranch(dto.getBranch());
        DtoLog.setCode(dto.getCode());
        DtoLog.setShortName(dto.getShortName());
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
        DtoLog.setAmendNo(dto.getAmendNo());
        DtoLog.setAmendNo(dto.getAmendNo());
        DtoLog.setAuthorizationDate(dto.getAuthorizationDate());
        DtoLog.setAuthorizationStatus(dto.getAuthorizationStatus());

        DtoLogs.add(DtoLog);
        return DtoLogs;
    }

    private List<BranchLogDTO> convertToLogDTO(List<BranchDTO> dtos) {

        if (dtos == null || dtos.isEmpty())
            return null;

        List<BranchLogDTO> logDtos = new ArrayList<>();

        for (BranchDTO dto : dtos) {
            if (dto == null) {
                continue; // Skip null DTOs
            }

            BranchLogDTO logDto = new BranchLogDTO();

            logDto.setBranchMstID(dto.getBranchMstID());
            logDto.setAuthId(dto.getAuthId());
            logDto.setBranch(dto.getBranch());
            logDto.setCode(dto.getCode());
            logDto.setCompanyEntity(dto.getCompanyEntity());
            logDto.setShortName(dto.getShortName());
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
            logDto.setActiveDate(dto.getActiveDate());
            logDto.setWithaffectdate(dto.getWithaffectdate());
            logDto.setAuthorizationDate(dto.getAuthorizationDate());
            logDto.setAuthorizationStatus(dto.getAuthorizationStatus());
            logDto.setUserCode(dto.getUserCode());
            logDto.setBranchLogPK(dto.getBranchLogPK());
            logDto.setAmendNo(dto.getAmendNo());
            logDtos.add(logDto);
        }
        return logDtos;
    }

    private void populateLogEntityPKfromEntity(Long logPk, Long logRowNo, BranchDTO entity) {
        for (BranchLogDTO entityLog : entity.getBranchDtoLogs()) {
            BranchLogPK LogPK = new BranchLogPK();
            LogPK.setBranchMstID(logPk);
            LogPK.setRowNo(logRowNo);
            entityLog.setBranchLogPK(LogPK);
            entity.setBranchLogPK(LogPK);
            logRowNo++;
        }

    }

    // To set the Log list in the entity to retrun to ui
    @Transactional(readOnly = true)
    public BranchDTO getBranchWithLogs(Long branchMstID) {

        // Fetch MST row
        BranchMst entity = branchRepository.findById(branchMstID)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Convert MST → DTO
        BranchDTO dto = entityToDto(entity);

        // Fetch ALL logs related to this MST
        List<BranchLog> Logs = branchLogRepository
                .findByBranchLogPK_BranchMstIDOrderByBranchLogPK_RowNoDesc(
                        branchMstID);

        Optional<BranchLog> selectedLog = Logs.stream()
                .filter(log -> log.getAuthorization() != null)
                .max(Comparator.comparing(BranchLog::getAmendNo))
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
                            .max(Comparator.comparing(BranchLog::getAmendNo));
                });

        // Case 3: no TRUE exists → fallback to latest FALSE
        if (!selectedLog.isPresent()) {
            selectedLog = Logs.stream()
                    .filter(log -> log.getAuthorization() != null)
                    .filter(log -> Boolean.FALSE.equals(
                            log.getAuthorization().getAuthorizationStatus()))
                    .max(Comparator.comparing(BranchLog::getAmendNo));
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
        });

        // Convert ALL logs → DTO list
        List<BranchLogDTO> logDtos = Logs.stream()
                .map(branchLogService::entityToDto)
                .toList();

        // Attach list to MST DTO
        dto.setBranchDtoLogs(logDtos);

        return dto;
    }

}
