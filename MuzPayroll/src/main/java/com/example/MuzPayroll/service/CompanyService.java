package com.example.MuzPayroll.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.DTO.CompanyDTO;
import com.example.MuzPayroll.controller.Response;
import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class CompanyService extends MuzirisAbstractService<CompanyDTO, CompanyMst> {

    private static final String UPLOAD_DIR = "/home/basilraju/Documents/MUZ Payroll/MuzPayroll/src/main/resources/Uploads/Company/";

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    // ================= FINAL SAVE WRAPPER =================
    public Response<CompanyDTO> saveWrapper(CompanyDTO dto) {
        try {
            // Delegate to the abstract class final save method
            return save(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.error("Failed to save company: " + e.getMessage());
        }
    }

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(CompanyDTO dto) {
        if (dto == null)
            return Response.error("DTO cannot be null");

        if (isEmpty(dto.getCompany()))
            return Response.error("Company name is required");
        if (isEmpty(dto.getShortName()))
            return Response.error("Short name is required");
        if (dto.getActiveDate() == null)
            return Response.error("Active date is required");
        // MultipartFile file = dto.getCompanyImage();

        // if (file == null || file.isEmpty()) {
        // return Response.error("Company image is required");
        // }
        if (isEmpty(dto.getAddress()))
            return Response.error("Address is required");
        if (isEmpty(dto.getCountry()))
            return Response.error("Country is required");
        if (isEmpty(dto.getState()))
            return Response.error("State is required");
        if (isEmpty(dto.getDistrict()))
            return Response.error("District is required");
        if (isEmpty(dto.getPlace()))
            return Response.error("Place is required");
        if (isEmpty(dto.getPincode()))
            return Response.error("Pincode is required");
        if (isEmpty(dto.getLatitude()))
            return Response.error("Latitude is required");
        if (isEmpty(dto.getLongitude()))
            return Response.error("Longitude is required");
        if (isEmpty(dto.getLandlineNumber()))
            return Response.error("Landline number is required");
        if (isEmpty(dto.getMobileNumber()))
            return Response.error("Mobile number is required");
        if (isEmpty(dto.getEmail()))
            return Response.error("Email is required");
        if (isEmpty(dto.getEmployerName()))
            return Response.error("Employer name is required");
        if (isEmpty(dto.getDesignation()))
            return Response.error("Employer designation is required");
        if (isEmpty(dto.getEmployerNumber()))
            return Response.error("Employer number is required");
        if (isEmpty(dto.getEmployerEmail()))
            return Response.error("Employer email is required");
        if (dto.getWithaffectdate() == null)
            return Response.error("With affect date is required");
        if (dto.getAuthorizationDate() == null)
            return Response.error("Authorization date is required");
        if (dto.getAuthorizationStatus() == null)
            return Response.error("Authorization status is required");
        if (isEmpty(dto.getUserCode()))
            return Response.error("User code is required");

        return Response.success(true, "Validation passed");
    }

    // =================== 2️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(CompanyDTO dto) {
        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            return Response.error("Invalid user code");

        return Response.success(true, "Business validation passed");
    }

    // =================== 3️⃣ ENTITY POPULATE ===================
    @Override
    public Response<CompanyMst> entityPopulate(CompanyDTO dto) {
        CompanyMst company = dtoToEntity(dto);
        return Response.success(company, "Entity populated");
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(CompanyDTO dto) {
        return Response.success(true, "PK generation not required");
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(CompanyDTO dto) {
        try {
            String prefix = "CM";
            CompanyMst lastCompany = companyRepository.findTopByCodeStartingWithOrderByCodeDesc(prefix);
            int nextNumber = 1;

            if (lastCompany != null && lastCompany.getCode() != null) {
                try {
                    nextNumber = Integer.parseInt(lastCompany.getCode().substring(prefix.length())) + 1;
                } catch (NumberFormatException e) {
                    nextNumber = 1;
                }
            }

            String code = prefix + String.format("%02d", nextNumber);
            dto.setCode(code);

            return Response.success(code, "Serial number generated");
        } catch (Exception e) {
            return Response.error("Failed to generate serial number");
        }
    }

    // =================== 6️⃣ DTO → ENTITY ===================
    @Override
    protected CompanyMst dtoToEntity(CompanyDTO dto) {
        CompanyMst company = new CompanyMst();
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
        return company;
    }

    // =================== 7️⃣ ENTITY → DTO ===================
    @Override
    public CompanyDTO entityToDto(CompanyMst entity) {
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
        return dto;
    }

    // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
    @Override
    protected CompanyMst saveEntityInService(CompanyMst company, CompanyDTO dto) {
        try {
            // ===== 1️⃣ SAVE IMAGE =====
            MultipartFile file = dto.getCompanyImage();
            if (file != null && !file.isEmpty()) {
                Files.createDirectories(Paths.get(UPLOAD_DIR));
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR, filename);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                company.setCompanyImage(UPLOAD_DIR + filename);
            } else if (dto.getCompanyImagePath() != null) {
                company.setCompanyImage(dto.getCompanyImagePath());
            }

            // ===== 2️⃣ SAVE MAIN COMPANY =====
            CompanyMst savedCompany = companyRepository.save(company);

            // ===== 3️⃣ SAVE AUTHORIZATION =====
            UserMst user = userRepository.findByUserCode(dto.getUserCode());
            Authorization auth = new Authorization();
            auth.setMstId(savedCompany.getId());
            auth.setAuthorizationDate(dto.getAuthorizationDate());
            auth.setAuthorizationStatus(dto.getAuthorizationStatus());
            auth.setUserMst(user);
            Authorization savedAuth = authorizationRepository.save(auth);

            // ===== 4️⃣ SAVE COMPANY LOG =====
            CompanyLog log = new CompanyLog();
            log.setAuthorization(savedAuth);
            log.setWithaffectdate(dto.getWithaffectdate());
            companyLogRepository.save(log);

            return savedCompany;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save company image: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error saving company and related entities: " + e.getMessage(), e);
        }
    }

    // =================== 9️⃣ UTILITY ===================
    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
