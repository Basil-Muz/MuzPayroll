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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyLogPK;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.DTO.CompanyLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class CompanyService extends MuzirisAbstractService<CompanyDTO, CompanyMst> {

    // private static final String UPLOAD_DIR =
    // "/src/main/java/com/example/MuzPayroll/Uploads/Company/";

    private static final String UPLOAD_DIR = "Uploads/company/";

    // Image validation constants
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp");

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyLogService companyLogService;

    @Autowired
    private CompanyLogRepository companyLogRepository;

    // ================= FINAL SAVE WRAPPER =================
    @Transactional
    public Response<CompanyDTO> saveWrapper(CompanyDTO dto, String mode) {
        List<CompanyDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        return save(dtos, mode);
    }

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<CompanyDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

            if ("INSERT".equals(mode)) {

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    CompanyDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (isEmpty(dto.getCompany()))
                        rowErrors.add("Company name is required");
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
                    if (dto.getActiveStatusYN() == null)
                        rowErrors.add("Active StatusYN is required");

                    // Add row errors to main error list with row number
                    if (!rowErrors.isEmpty()) {
                        hasAnyError = true;

                        // Create a prefix for this row's errors
                        String rowPrefix = "Row " + rowNumber;
                        if (!isEmpty(dto.getCompany())) {
                            rowPrefix += " (Company: " + dto.getCompany() + ")";
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
                    CompanyDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (dto.getCompanyMstID() == null)
                        rowErrors.add("Company ID is required");
                    if (isEmpty(dto.getCompany()))
                        rowErrors.add("Company name is required");
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
                    if (dto.getActiveStatusYN() == null)
                        rowErrors.add("Active StatusYN is required");

                    // Add row errors to main error list with row number
                    if (!rowErrors.isEmpty()) {
                        hasAnyError = true;

                        // Create a prefix for this row's errors
                        String rowPrefix = "Row " + rowNumber;
                        if (!isEmpty(dto.getCompany())) {
                            rowPrefix += " (Company: " + dto.getCompany() + ")";
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
        List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityValidate = companyLogService.entityValidate(logDtos, mode);

        // If log validation fails, return those errors
        if (!logEntityValidate.isSuccess()) {
            return logEntityValidate;
        }
        // <-----

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<CompanyDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        CompanyDTO dto = dtos.get(0);

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

            Long mstId = dto.getCompanyMstID();

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
        List<CompanyLogDTO> companyDtoLogs = populateLogEntityfromEntity(dto);
        dto.setCompanyDtoLogs(companyDtoLogs);

        // CALL CompanyLogService entityValidate
        List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
        Response<Boolean> logEntityPopulate = companyLogService.entityPopulate(logDtos, mode);

        // If log entityPopulate fails, return errors
        if (!logEntityPopulate.isSuccess()) {
            return Response.error(logEntityPopulate.getErrors());
        }
        // <-----

        return Response.success(true);

    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<CompanyDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
            CompanyDTO dto = dtos.get(0);

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
                dto.setCompanyImagePath(imagePath);
            }

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }

            // if log table present ---->

            List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Boolean> logbusinessValidate = companyLogService.businessValidate(logDtos, mode);

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
    public Response<Object> generatePK(List<CompanyDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("No company data provided");
        }

        try {

            if ("INSERT".equals(mode)) {

                // Process each DTO in the list
                for (CompanyDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    Long companyMstID = dto.getCompanyMstID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (companyMstID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = companyRepository.existsById(companyMstID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = companyMstID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("Company ID " + companyMstID + " does not exist in database");
                            continue;
                        }

                    }
                    // ID IS NOT PROVIDED IN DTO (null)
                    else {
                        // Find maximum ID from database
                        Long maxId = companyRepository.findMaxCompanyMstID();

                        if (maxId == null) {
                            // No data in DB - start from 100000
                            generatedId = 100000L;
                        } else {
                            // Data exists - get latest data and increment
                            generatedId = maxId + 1;

                            if (generatedId > 999999L) {
                                errors.add("Cannot generate ID. Maximum limit (999999) reached for company: " +
                                        (dto.getCompany() != null ? dto.getCompany() : "Unknown"));
                                continue;
                            }
                        }

                        dto.setCompanyMstID(generatedId);
                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        Long transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = companyLogService.getMaxRowNo(transID);

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
                for (CompanyDTO dto : dtos) {
                    if (dto == null) {
                        errors.add("Null DTO found in list");
                        continue;
                    }

                    Long companyMstID = dto.getCompanyMstID();
                    Long generatedId = null;

                    // ID IS PROVIDED IN DTO
                    if (companyMstID != null) {
                        // Check if this ID exists in database
                        boolean existsInDB = companyRepository.existsById(companyMstID);

                        if (existsInDB) {
                            // ID is present in DB
                            generatedId = companyMstID;
                        } else {
                            // ID provided but NOT in DB - RETURN ERROR
                            errors.add("Company ID " + companyMstID + " does not exist in database");
                            continue;
                        }

                    }

                    // Process log rows for this DTO
                    if (generatedId != null) {
                        Long transID = generatedId;
                        Long logRowNo = 1L; // Default to 1

                        // Get max row number for this transaction
                        Response<Long> responseLogMaxRowNo = companyLogService.getMaxRowNo(transID);

                        Long mstId = dto.getCompanyMstID();

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
            List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
            Response<Object> logGeneratePK = companyLogService.generatePK(logDtos, mode);

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
    public Response<String> generateSerialNo(List<CompanyDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        CompanyDTO dto = dtos.get(0);

        try {
            if ("INSERT".equals(mode)) {

                String prefix = "CM";

                // Generate new code
                Pageable pageable = PageRequest.of(0, 1);
                List<CompanyMst> companies = companyRepository.findLatestCompanyWithCMPrefix(pageable);

                String generatedCode;

                if (companies == null || companies.isEmpty()) {
                    generatedCode = prefix + "01";
                } else {
                    CompanyMst latestCompany = companies.get(0);
                    String latestCode = latestCompany.getCode();

                    // Extract and increment
                    String numberPart = latestCode.substring(prefix.length());
                    String digits = numberPart.replaceAll("[^0-9]", "");
                    int latestNumber = Integer.parseInt(digits);
                    int nextNumber = latestNumber + 1;

                    // Check limit
                    if (nextNumber > 99) {
                        errors.add("Company code limit reached (max: CM99)");
                    }

                    generatedCode = prefix + String.format("%02d", nextNumber);
                }

                // SET CODE IN BOTH DTO AND ENTITY
                dto.setCode(generatedCode);
            }

            // For UPDATE mode
            else if ("UPDATE".equals(mode)) {

                Long companyMstID = dto.getCompanyMstID();

                String code = companyRepository
                        .findCodeByMstId(companyMstID)
                        .orElseThrow(
                                () -> new IllegalStateException("code not found for companyMstID " + companyMstID));

                // Check format
                if (!code.startsWith("CM")) {
                    errors.add("Invalid company code format. Must start with 'CM'");
                }

                // Check if code already exists
                Optional<CompanyMst> exists = companyRepository.findByCode(code);
                if (exists.isEmpty() || exists == null) {
                    errors.add("Company code '" + code + "' not exists");
                }

                // SET CODE IN DTO
                dto.setCode(code);
            }
            // if log table present ---->

            List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
            Response<String> loggenerateSerialNo = companyLogService.generateSerialNo(logDtos, mode);
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
            String fallbackCode = "CM01";
            dto.setCode(fallbackCode);
            return Response.success(fallbackCode);
        }
    }

    // =================== 6️⃣ converttoEntity ===================
    @Override
    public Response<CompanyMst> converttoEntity(List<CompanyDTO> dtos) {

        // ===== CREATE COMPANY ENTITY =====
        CompanyMst company = dtoToEntity(dtos);

        // if log table present ---->
        List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
        Response<CompanyLog> logconverttoEntity = companyLogService.converttoEntity(logDtos);

        if (!logconverttoEntity.isSuccess()) {
            return Response.error("Company Log Dto is not converted");
        }
        // <-----

        return Response.success(company);

    }

    // =================== DTO → ENTITY ===================
    @Override
    protected CompanyMst dtoToEntity(List<CompanyDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }

        // Take the first DTO from the list
        CompanyDTO dto = dtos.get(0);

        CompanyMst company = new CompanyMst();

        // Set ALL fields from the first DTO
        company.setCompanyMstID(dto.getCompanyMstID());
        company.setCode(dto.getCode());
        company.setCompany(dto.getCompany());
        company.setShortName(dto.getShortName());
        company.setActiveDate(dto.getActiveDate());
        company.setAddress(dto.getAddress());
        company.setAddress1(dto.getAddress1());
        company.setAddress2(dto.getAddress2());
        company.setCountry(dto.getCountry());
        company.setState(dto.getState());
        company.setDistrict(dto.getDistrict());
        company.setPlace(dto.getPlace());
        company.setPincode(dto.getPincode());
        company.setLandlineNumber(dto.getLandlineNumber());
        company.setMobileNumber(dto.getMobileNumber());
        company.setEmail(dto.getEmail());
        company.setDesignation(dto.getDesignation());
        company.setEmployerName(dto.getEmployerName());
        company.setEmployerNumber(dto.getEmployerNumber());
        company.setEmployerEmail(dto.getEmployerEmail());
        company.setWithaffectdate(dto.getWithaffectdate());
        company.setActiveStatusYN(dto.getActiveStatusYN());
        company.setAmendNo(dto.getAmendNo());
        company.setInactiveDate(dto.getInactiveDate());

        // Set image path if already available in DTO
        if (dto.getCompanyImagePath() != null) {
            company.setCompanyImage(dto.getCompanyImagePath());
        }

        // Set authorization if available
        if (dto.getAuthorization() != null) {
            company.setAuthorization(dto.getAuthorization());
        }

        return company;
    }

    // =================== ENTITY → DTO ===================

    @Override
    public CompanyDTO entityToDto(CompanyMst entity) {

        CompanyDTO dto = new CompanyDTO();

        dto.setCompanyMstID(entity.getCompanyMstID());
        dto.setCode(entity.getCode());
        dto.setCompany(entity.getCompany());
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
        dto.setDesignation(entity.getDesignation());
        dto.setEmployerName(entity.getEmployerName());
        dto.setEmployerNumber(entity.getEmployerNumber());
        dto.setEmployerEmail(entity.getEmployerEmail());
        dto.setCompanyImagePath(entity.getCompanyImage());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setActiveStatusYN(entity.getActiveStatusYN());
        dto.setAmendNo(entity.getAmendNo());
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
    protected CompanyMst saveEntity(CompanyMst company, List<CompanyDTO> dtos, String mode) {

        CompanyDTO dto = dtos.get(0);
        CompanyMst savedCompany = null;

        if ("INSERT".equalsIgnoreCase(mode)) {

            // ===== SAVE COMPANY =====
            savedCompany = companyRepository.save(company);

            // ===== SAVE AUTHORIZATION =====
            Authorization auth = company.getAuthorization();
            auth.setMstId(savedCompany.getCompanyMstID());

            Authorization savedAuth = authorizationRepository.save(auth);
            dto.setAuthId(savedAuth.getAuthId());

        } else if ("UPDATE".equalsIgnoreCase(mode)) {

            if (Boolean.TRUE.equals(dto.getAuthorizationStatus())) {

                // ===== SAVE COMPANY =====
                savedCompany = companyRepository.save(company);

                // ===== SAVE AUTHORIZATION =====
                Authorization auth = company.getAuthorization();
                auth.setMstId(savedCompany.getCompanyMstID());
                authorizationRepository.save(auth);
                Authorization savedAuth = authorizationRepository.save(auth);
                dto.setAuthId(savedAuth.getAuthId());

            } else {

                Long mstId = dto.getCompanyMstID();

                long count = authorizationRepository.countByMstId(mstId);

                if (count == 1) {
                    // Exactly ONE row exists
                    Optional<Boolean> statusOpt = authorizationRepository.findStatusByMstId(mstId);

                    if (statusOpt.isPresent()) {
                        Boolean status = statusOpt.get();

                        if (Boolean.TRUE.equals(status)) {
                            // No save, return existing entity
                            savedCompany = company;
                            // ===== SAVE AUTHORIZATION =====
                            Authorization auth = company.getAuthorization();
                            auth.setMstId(savedCompany.getCompanyMstID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setAuthId(savedAuth.getAuthId());
                        } else if (Boolean.FALSE.equals(status)) {
                            // ===== SAVE COMPANY =====
                            savedCompany = companyRepository.save(company);

                            // ===== SAVE AUTHORIZATION =====
                            Authorization auth = company.getAuthorization();
                            auth.setMstId(savedCompany.getCompanyMstID());
                            authorizationRepository.save(auth);
                            Authorization savedAuth = authorizationRepository.save(auth);
                            dto.setAuthId(savedAuth.getAuthId());

                        }
                    }
                } else if (count > 1) {

                    // MORE THAN ONE row exists
                    // No save, return existing entity
                    savedCompany = company;
                    // ===== SAVE AUTHORIZATION =====
                    Authorization auth = company.getAuthorization();
                    auth.setMstId(savedCompany.getCompanyMstID());
                    authorizationRepository.save(auth);
                    Authorization savedAuth = authorizationRepository.save(auth);
                    dto.setAuthId(savedAuth.getAuthId());
                }

            }

        } else {
            throw new IllegalArgumentException("Invalid mode: " + mode);
        }

        // ===== SAVE COMPANY LOG =====
        CompanyLog logEntity = new CompanyLog();
        List<CompanyLogDTO> logDtos = convertToLogDTO(dtos);
        companyLogService.saveEntity(logEntity, logDtos, mode);

        return savedCompany;
    }

    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    private List<CompanyLogDTO> populateLogEntityfromEntity(CompanyDTO dto) {

        List<CompanyLogDTO> companyDtoLogs = new ArrayList<>();
        CompanyLogDTO companyDtoLog = new CompanyLogDTO();

        companyDtoLog.setCompanyMstID(dto.getCompanyMstID());
        companyDtoLog.setCompany(dto.getCompany());
        companyDtoLog.setCode(dto.getCode());
        companyDtoLog.setShortName(dto.getShortName());
        companyDtoLog.setActiveDate(dto.getActiveDate());
        companyDtoLog.setWithaffectdate(dto.getWithaffectdate());
        companyDtoLog.setAddress(dto.getAddress());
        companyDtoLog.setAddress1(dto.getAddress1());
        companyDtoLog.setAddress2(dto.getAddress2());
        companyDtoLog.setCountry(dto.getCountry());
        companyDtoLog.setState(dto.getState());
        companyDtoLog.setDistrict(dto.getDistrict());
        companyDtoLog.setPlace(dto.getPlace());
        companyDtoLog.setPincode(dto.getPincode());
        companyDtoLog.setLandlineNumber(dto.getLandlineNumber());
        companyDtoLog.setMobileNumber(dto.getMobileNumber());
        companyDtoLog.setEmail(dto.getEmail());
        companyDtoLog.setEmployerName(dto.getEmployerName());
        companyDtoLog.setDesignation(dto.getDesignation());
        companyDtoLog.setEmployerNumber(dto.getEmployerNumber());
        companyDtoLog.setEmployerEmail(dto.getEmployerEmail());
        companyDtoLog.setCompanyImage(dto.getCompanyImage());
        companyDtoLog.setAmendNo(dto.getAmendNo());
        companyDtoLog.setAuthorizationDate(dto.getAuthorizationDate());
        companyDtoLog.setAuthorizationStatus(dto.getAuthorizationStatus());

        companyDtoLogs.add(companyDtoLog);
        return companyDtoLogs;
    }

    private List<CompanyLogDTO> convertToLogDTO(List<CompanyDTO> dtos) {

        if (dtos == null || dtos.isEmpty())
            return null;

        List<CompanyLogDTO> logDtos = new ArrayList<>();

        for (CompanyDTO dto : dtos) {
            if (dto == null) {
                continue; // Skip null DTOs
            }

            CompanyLogDTO logDto = new CompanyLogDTO();

            logDto.setCompanyMstID(dto.getCompanyMstID());
            logDto.setAuthId(dto.getAuthId());
            logDto.setCode(dto.getCode());
            logDto.setCompany(dto.getCompany());
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
            logDto.setEmployerName(dto.getEmployerName());
            logDto.setDesignation(dto.getDesignation());
            logDto.setEmployerNumber(dto.getEmployerNumber());
            logDto.setEmployerEmail(dto.getEmployerEmail());
            logDto.setActiveDate(dto.getActiveDate());
            logDto.setWithaffectdate(dto.getWithaffectdate());
            logDto.setAuthorizationDate(dto.getAuthorizationDate());
            logDto.setAuthorizationStatus(dto.getAuthorizationStatus());
            logDto.setUserCode(dto.getUserCode());
            logDto.setCompanyImagePath(dto.getCompanyImagePath());
            logDto.setCompanyLogPK(dto.getCompanyLogPK());
            logDto.setAmendNo(dto.getAmendNo());
            logDtos.add(logDto);
        }
        return logDtos;
    }

    // =================== 🔟 IMAGE VALIDATION AND PROCESSING ===================
    private Response<String> validateAndProcessImage(CompanyDTO dto) {
        MultipartFile file = dto.getCompanyImage();

        // If no new image uploaded and no existing image path, image is required
        if ((file == null || file.isEmpty()) && isEmpty(dto.getCompanyImagePath())) {
            return Response.error("Company image is required");
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
                return Response.error("Failed to save company image: " + e.getMessage());
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
            errors.add("Company image size must be less than 5MB. Current size: " +
                    formatFileSize(fileSize));
        }

        // Check file type
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            // Also check by file extension as fallback
            if (originalFilename != null) {
                String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
                if (!isValidImageExtension(extension)) {
                    errors.add("Invalid image format. Allowed formats: JPEG, JPG, PNG, GIF, BMP, WEBP");
                }
            } else {
                errors.add("Invalid image format. Allowed formats: JPEG, JPG, PNG, GIF, BMP, WEBP");
            }
        }

        // Check filename for security
        if (originalFilename != null) {
            if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
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

    // To set LogEntityPK from Entity
    private void populateLogEntityPKfromEntity(Long logPk, Long logRowNo, CompanyDTO entity) {

        for (CompanyLogDTO entityLog : entity.getCompanyDtoLogs()) {
            CompanyLogPK companyLogPK = new CompanyLogPK();
            companyLogPK.setCompanyMstID(logPk);
            companyLogPK.setRowNo(logRowNo);
            entityLog.setCompanyLogPK(companyLogPK);
            entity.setCompanyLogPK(companyLogPK);
            logRowNo++;
        }

    }

    // To set the Log list in the entity to retrun to ui
    @Transactional(readOnly = true)
    public CompanyDTO getCompanyWithLogs(Long companyMstID) {

        // Fetch MST row
        CompanyMst entity = companyRepository.findById(companyMstID)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Convert MST → DTO
        CompanyDTO dto = entityToDto(entity);

        // Fetch ALL logs related to this MST
        List<CompanyLog> companyLogs = companyLogRepository
                .findByCompanyLogPK_CompanyMstIDOrderByCompanyLogPK_RowNoDesc(
                        companyMstID);

        Optional<CompanyLog> selectedLog = companyLogs.stream()
                .filter(log -> log.getAuthorization() != null)
                .max(Comparator.comparing(CompanyLog::getAmendNo))
                .flatMap(latestLog -> {

                    // Case 1: latest is TRUE → return it
                    if (Boolean.TRUE.equals(
                            latestLog.getAuthorization().getAuthorizationStatus())) {
                        return Optional.of(latestLog);
                    }

                    // Case 2: latest is FALSE → find latest TRUE
                    return companyLogs.stream()
                            .filter(log -> log.getAuthorization() != null)
                            .filter(log -> Boolean.TRUE.equals(
                                    log.getAuthorization().getAuthorizationStatus()))
                            .max(Comparator.comparing(CompanyLog::getAmendNo));
                });

        // Case 3: no TRUE exists → fallback to latest FALSE
        if (!selectedLog.isPresent()) {
            selectedLog = companyLogs.stream()
                    .filter(log -> log.getAuthorization() != null)
                    .filter(log -> Boolean.FALSE.equals(
                            log.getAuthorization().getAuthorizationStatus()))
                    .max(Comparator.comparing(CompanyLog::getAmendNo));
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
        List<CompanyLogDTO> logDtos = companyLogs.stream()
                .map(companyLogService::entityToDto)
                .toList();

        // Attach list to MST DTO
        dto.setCompanyDtoLogs(logDtos);

        return dto;
    }

}