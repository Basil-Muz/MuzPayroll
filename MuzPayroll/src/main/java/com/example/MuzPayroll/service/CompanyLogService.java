package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
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
    public Response<Boolean> entityValidate(CompanyLogDTO dto) {
        if (dto == null)
            return Response.error("DTO cannot be null");
        List<String> errors = new ArrayList<>();

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<CompanyLog> entityPopulate(CompanyLogDTO dto) {
        List<String> errors = new ArrayList<>();

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        // ===== CREATE COMPANY LOG ENTITY =====
        CompanyLog companyLog = new CompanyLog();

        return Response.success(companyLog);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(CompanyLogDTO dto, CompanyLog log) {

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

            // Set it in the CompanyLog entity
            if (log != null) {
                log.setCompanyImage(imagePath);
            } else {
                System.out.println("Entity is null, cannot set image path");
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
    public Response<Object> generatePK(CompanyLogDTO dto) {
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(CompanyLogDTO dto, CompanyLog entity) {
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

    // =================== 6️⃣ DTO → ENTITY ===================
    @Override
    protected CompanyLog dtoToEntity(CompanyLogDTO dto) {
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

        // Set image path if already available in DTO
        if (dto.getCompanyImagePath() != null) {
            companyLog.setCompanyImage(dto.getCompanyImagePath());
        }

        return companyLog;
    }

    // =================== 7️⃣ ENTITY → DTO ===================
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
        return dto;
    }

    // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected CompanyLog saveEntity(CompanyLog log, CompanyLogDTO dto) {
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

            // SET COMPANY IMAGE FROM DTO
            if (dto.getCompanyImagePath() != null) {
                log.setCompanyImage(dto.getCompanyImagePath());
            } else {
                System.out.println("No image path in DTO");
            }

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

    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

}
