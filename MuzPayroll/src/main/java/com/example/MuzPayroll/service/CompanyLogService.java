package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.DTO.CompanyLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class CompanyLogService extends MuzirisAbstractService<CompanyLogDTO, CompanyLog> {

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private UserRepository userRepository;

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<CompanyLogDTO> dtos) {
        if (dtos == null)
            return Response.error("DTO cannot be null");
        List<String> errors = new ArrayList<>();

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<CompanyLogDTO> dtos) {
        List<String> errors = new ArrayList<>();
        CompanyLogDTO dto = dtos.get(0);

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        return Response.success(true);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<CompanyLogDTO> dtos) {
        CompanyLogDTO dto = dtos.get(0);

        List<String> errors = new ArrayList<>();

        String imagePath = dto.getCompanyImagePath();

        if (imagePath != null) {
            // Validate imagePath
            String lowerPath = imagePath.toLowerCase();
            boolean isValid = lowerPath.endsWith(".png") ||
                    lowerPath.endsWith(".jpg") ||
                    lowerPath.endsWith(".jpeg") ||
                    lowerPath.endsWith(".gif");

            if (!isValid) {
                errors.add("Invalid image path format for audit log");
            }
        } else {
            System.out.println("No image path in DTO");
        }

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(List<CompanyLogDTO> dtos) {

        List<String> errors = new ArrayList<>();

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("No company data provided");
        }

        CompanyLogDTO dto = dtos.get(0);
        Long companyMstID = dto.getCompanyMstID();
        // System.out.println("companymstid*************************************************"
        // + companyMstID);
        // try {
        // Long generatedRowNO;

        // // SCENARIO 1: ID IS PROVIDED IN DTO
        // if (companyMstID != null) {
        // String prefix = String.valueOf(companyMstID);

        // List<CompanyLog> companies =
        // companyLogRepository.findAllByCompanyLogIDStartingWith(prefix);

        // if (companies == null || companies.isEmpty()) {
        // // No existing records - start from 1
        // generatedRowNO = 1L;
        // dto.setRowNo(generatedRowNO);

        // } else {
        // // Get max ID and split it
        // Long maxID = companyLogRepository.findMaxByCompanyLogIDStartingWith(prefix);

        // if (maxID == null) {
        // // Shouldn't happen if companies list is not empty, but handle it
        // generatedRowNO = 1L;
        // } else {
        // // Convert to String
        // String maxIDStr = String.valueOf(maxID);

        // // Extract suffix (everything after the prefix)
        // String suffix = maxIDStr.substring(prefix.length());

        // System.out.println("Prefix: " + prefix);
        // System.out.println("Max ID: " + maxIDStr);
        // System.out.println("Suffix extracted: " + suffix);

        // try {
        // // Convert suffix to number and increment
        // Long suffixNumber = Long.parseLong(suffix);
        // generatedRowNO = suffixNumber + 1;

        // } catch (NumberFormatException e) {
        // // If suffix is not a valid number, start from 1
        // generatedRowNO = 1L;
        // }
        // }

        // dto.setRowNo(generatedRowNO);
        // }

        // System.out.println("Generated Row No: " + dto.getRowNo());

        // } else {
        // // SCENARIO 2: ID IS NOT PROVIDED
        // errors.add("CompanyMstID is required");
        // }

        // } catch (Exception e) {
        // e.printStackTrace();
        // errors.add("Error generating PK: " + e.getMessage());
        // }
        // // Process further if needed

        Long generatedRowNO = 1L;
        dto.setRowNo(generatedRowNO);

        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<CompanyLogDTO> dto) {
        // try {

        // String prefix = "CM";

        // // Generate new code
        // Pageable pageable = PageRequest.of(0, 1);
        // List<CompanyMst> companies =
        // companyRepository.findLatestCompanyWithCMPrefix(pageable);

        // String generatedCode;

        // if (companies == null || companies.isEmpty()) {
        // generatedCode = prefix + "01";
        // } else {
        // CompanyMst latestCompany = companies.get(0);
        // String latestCode = latestCompany.getCode();

        // // Extract and increment
        // String numberPart = latestCode.substring(prefix.length());
        // String digits = numberPart.replaceAll("[^0-9]", "");
        // int latestNumber = Integer.parseInt(digits);
        // int nextNumber = latestNumber + 1;

        // // Check limit
        // if (nextNumber > 99) {
        // return Response.error("Company code limit reached (max: CM99)");
        // }

        // generatedCode = prefix + String.format("%02d", nextNumber);
        // }

        // // SET CODE IN BOTH DTO AND ENTITY
        // dto.setCode(generatedCode);

        // if (entity != null) {
        // entity.setCode(generatedCode);
        // } else {
        // System.err.println(" WARNING: Entity is null in generateSerialNo!");
        // }

        // return Response.success(generatedCode);

        // } catch (Exception e) {
        // e.printStackTrace();

        // // Last resort fallback
        // String fallbackCode = "CM01";
        // dto.setCode(fallbackCode);
        // if (entity != null) {
        // entity.setCode(fallbackCode);
        // }
        // return Response.success(fallbackCode);
        // }

        return Response.success("Operation successful");

    }

    // =================== 6️⃣ converttoEntity ===================

    @Override
    public Response<CompanyLog> converttoEntity(List<CompanyLogDTO> dto) {

        // ===== CREATE COMPANY ENTITY =====
        // CompanyLog company = dtoToEntity(dto);
        CompanyLog company = new CompanyLog();
        return Response.success(company);
    }

    // =================== DTO → ENTITY ===================
    @Override
    protected CompanyLog dtoToEntity(List<CompanyLogDTO> dtos) {
        CompanyLogDTO dto = dtos.get(0);

        CompanyLog companyLog = new CompanyLog();

        // Set ALL fields
        companyLog.setCode(dto.getCode());
        companyLog.setCompany(dto.getCompany());
        companyLog.setShortName(dto.getShortName());
        companyLog.setActiveDate(dto.getActiveDate());
        companyLog.setAddress(dto.getAddress());
        companyLog.setAddress1(dto.getAddress1());
        companyLog.setAddress2(dto.getAddress2());
        companyLog.setCountry(dto.getCountry());
        companyLog.setState(dto.getState());
        companyLog.setDistrict(dto.getDistrict());
        companyLog.setPlace(dto.getPlace());
        companyLog.setPincode(dto.getPincode());
        companyLog.setLandlineNumber(dto.getLandlineNumber());
        companyLog.setMobileNumber(dto.getMobileNumber());
        companyLog.setEmail(dto.getEmail());
        companyLog.setDesignation(dto.getDesignation());
        companyLog.setEmployerName(dto.getEmployerName());
        companyLog.setEmployerNumber(dto.getEmployerNumber());
        companyLog.setEmployerEmail(dto.getEmployerEmail());
        companyLog.setWithaffectdate(dto.getWithaffectdate());
        companyLog.setCompanyImage(dto.getCompanyImagePath());
        // companyLog.setRowNo(dto.getRowNo());

        return companyLog;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public CompanyLogDTO entityToDto(CompanyLog entity) {
        CompanyLogDTO dto = new CompanyLogDTO();
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
        dto.setCompanyImagePath(entity.getCompanyImage());
        dto.setWithaffectdate(entity.getWithaffectdate());
        // dto.setRowNo(entity.getRowNo());
        return dto;
    }

    // =================== SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected CompanyLog saveEntity(CompanyLog log, List<CompanyLogDTO> dtos) {
        CompanyLogDTO dto = dtos.get(0);
        try {
            log.setCompany(dto.getCompany());
            log.setCode(dto.getCode());
            log.setShortName(dto.getShortName());
            log.setActiveDate(dto.getActiveDate());
            log.setWithaffectdate(dto.getWithaffectdate());
            log.setAddress(dto.getAddress());
            log.setAddress1(dto.getAddress1());
            log.setAddress2(dto.getAddress2());
            log.setCountry(dto.getCountry());
            log.setState(dto.getState());
            log.setDistrict(dto.getDistrict());
            log.setPlace(dto.getPlace());
            log.setPincode(dto.getPincode());
            log.setLandlineNumber(dto.getLandlineNumber());
            log.setMobileNumber(dto.getMobileNumber());
            log.setEmail(dto.getEmail());
            log.setEmployerName(dto.getEmployerName());
            log.setDesignation(dto.getDesignation());
            log.setEmployerNumber(dto.getEmployerNumber());
            log.setEmployerEmail(dto.getEmployerEmail());
            log.setCompanyImage(dto.getCompanyImagePath());
            // log.setRowNo(dto.getRowNo());

            // SET AUTHORIZATION
            if (dto.getAuthId() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getAuthId());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for CompanyLog");
            }

            // SAVE TO DATABASE
            CompanyLog savedLog = companyLogRepository.save(log);

            return savedLog;

        } catch (Exception e) {
            System.err.println("Error saving company log: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error saving company log: " + e.getMessage(), e);
        }
    }

}
