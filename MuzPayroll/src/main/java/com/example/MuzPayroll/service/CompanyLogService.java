package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class CompanyLogService extends MuzirisAbstractService<CompanyDTO, CompanyLog> {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private UserRepository userRepository;

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(CompanyDTO dto) {
        if (dto == null)
            return Response.error("DTO cannot be null");
        List<String> errors = new ArrayList<>();

        // Collect ALL errors
        if (isEmpty(dto.getCompany()))
            errors.add("Company name is required");
        if (isEmpty(dto.getShortName()))
            errors.add("Short name is required");
        if (dto.getActiveDate() == null)
            errors.add("Active date is required");
        if (isEmpty(dto.getAddress()))
            errors.add("Address is required");
        if (isEmpty(dto.getCountry()))
            errors.add("Country is required");
        if (isEmpty(dto.getState()))
            errors.add("State is required");
        if (isEmpty(dto.getDistrict()))
            errors.add("District is required");
        if (isEmpty(dto.getPlace()))
            errors.add("Place is required");
        if (isEmpty(dto.getPincode()))
            errors.add("Pincode is required");
        if (isEmpty(dto.getLatitude()))
            errors.add("Latitude is required");
        if (isEmpty(dto.getLongitude()))
            errors.add("Longitude is required");
        if (isEmpty(dto.getLandlineNumber()))
            errors.add("Landline number is required");
        if (isEmpty(dto.getMobileNumber()))
            errors.add("Mobile number is required");
        if (isEmpty(dto.getEmail()))
            errors.add("Email is required");
        if (isEmpty(dto.getEmployerName()))
            errors.add("Employer name is required");
        if (isEmpty(dto.getDesignation()))
            errors.add("Employer designation is required");
        if (isEmpty(dto.getEmployerNumber()))
            errors.add("Employer number is required");
        if (isEmpty(dto.getEmployerEmail()))
            errors.add("Employer email is required");
        if (dto.getWithaffectdate() == null)
            errors.add("With affect date is required");
        if (dto.getAuthorizationDate() == null)
            errors.add("Authorization date is required");
        if (dto.getAuthorizationStatus() == null)
            errors.add("Authorization status is required");
        if (isEmpty(dto.getUserCode()))
            errors.add("User code is required");

        // Check if we have any errors
        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<CompanyLog> entityPopulate(CompanyDTO dto) {
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
    public Response<Boolean> businessValidate(CompanyDTO dto, CompanyLog log) {

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
            System.out.println("⚠️ No image path in DTO");
        }

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(CompanyDTO dto) {
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(CompanyDTO dto, CompanyLog entity) {
        try {

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
                    return Response.error("Company code limit reached (max: CM99)");
                }

                generatedCode = prefix + String.format("%02d", nextNumber);
            }

            // SET CODE IN BOTH DTO AND ENTITY
            dto.setCode(generatedCode);

            if (entity != null) {
                entity.setCode(generatedCode);
            } else {
                System.err.println(" WARNING: Entity is null in generateSerialNo!");
            }

            return Response.success(generatedCode);

        } catch (Exception e) {
            e.printStackTrace();

            // Last resort fallback
            String fallbackCode = "CM01";
            dto.setCode(fallbackCode);
            if (entity != null) {
                entity.setCode(fallbackCode);
            }
            return Response.success(fallbackCode);
        }
    }

    // =================== 6️⃣ DTO → ENTITY ===================
    @Override
    protected CompanyLog dtoToEntity(CompanyDTO dto) {
        CompanyLog company = new CompanyLog();

        // Set ALL fields
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
        company.setLatitude(dto.getLatitude());
        company.setLongitude(dto.getLongitude());
        company.setLandlineNumber(dto.getLandlineNumber());
        company.setMobileNumber(dto.getMobileNumber());
        company.setEmail(dto.getEmail());
        company.setDesignation(dto.getDesignation());
        company.setEmployerName(dto.getEmployerName());
        company.setEmployerNumber(dto.getEmployerNumber());
        company.setEmployerEmail(dto.getEmployerEmail());
        company.setWithaffectdate(dto.getWithaffectdate());

        // Set image path if already available in DTO
        if (dto.getCompanyImagePath() != null) {
            company.setCompanyImage(dto.getCompanyImagePath());
        }

        return company;
    }

    // =================== 7️⃣ ENTITY → DTO ===================
    @Override
    public CompanyDTO entityToDto(CompanyLog entity) {
        CompanyDTO dto = new CompanyDTO();
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
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
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
    protected CompanyLog saveEntity(CompanyLog log, CompanyDTO dto) {
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
            log.setLatitude(dto.getLatitude());
            log.setLongitude(dto.getLongitude());
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
                System.out.println("⚠️ No image path in DTO");
            }

            // SET AUTHORIZATION (MOST IMPORTANT!)
            if (dto.getAuthId() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getAuthId()); // Set only the ID for foreign key
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("❌ Authorization ID is required for CompanyLog");
            }

            // SAVE TO DATABASE
            CompanyLog savedLog = companyLogRepository.save(log);

            return savedLog;

        } catch (Exception e) {
            System.err.println("❌ Error saving company log: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error saving company log: " + e.getMessage(), e);
        }
    }

    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

}
