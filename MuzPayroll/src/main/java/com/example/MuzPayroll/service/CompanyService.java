package com.example.MuzPayroll.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    private static final String UPLOAD_DIR = "/home/basilraju/Documents/MUZ Payroll/MuzPayroll/Uploads/Company/";

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    // ================= FINAL SAVE WRAPPER =================
    @Transactional
    public Response<CompanyDTO> saveWrapper(CompanyDTO dto) {
        return save(dto); // 🔥 THIS is important
    }

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
            // Combine ALL errors into one message
            String errorMessage = String.join("; ", errors);
            return Response.error(errorMessage);
        }

        return Response.success(true);
    }

    // =================== 2️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(CompanyDTO dto) {
        List<String> errors = new ArrayList<>();

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        // Add other business validations here
        // Example: Check if company name already exists
        // if (companyRepository.existsByCompanyName(dto.getCompany()))
        // errors.add("Company name already exists");

        if (!errors.isEmpty()) {
            String errorMessage = String.join("; ", errors);
            return Response.error(errorMessage);
        }

        return Response.success(true);
    }

    // =================== 3️⃣ ENTITY POPULATE ===================
    @Override
    public Response<CompanyMst> entityPopulate(CompanyDTO dto) {
        CompanyMst company = dtoToEntity(dto);
        return Response.success(company);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(CompanyDTO dto) {
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(CompanyDTO dto) {
        try {
            String prefix = "CM";

            // Get all companies from database
            List<CompanyMst> allCompanies = companyRepository.findAll();

            System.out.println("=== DEBUG: Checking " + allCompanies.size() + " companies ===");

            // Extract all existing CM## codes
            Set<String> existingCodes = new HashSet<>();
            List<Integer> existingNumbers = new ArrayList<>();

            for (CompanyMst company : allCompanies) {
                String code = company.getCode();
                if (code != null && code.startsWith(prefix)) {
                    existingCodes.add(code);
                    System.out.println("Found existing code: " + code);

                    // Try to extract number part
                    String numberPart = code.substring(prefix.length());
                    String digits = numberPart.replaceAll("[^0-9]", "");

                    if (!digits.isEmpty()) {
                        try {
                            int num = Integer.parseInt(digits);
                            existingNumbers.add(num);
                        } catch (NumberFormatException e) {
                            // Ignore non-numeric parts
                        }
                    }
                }
            }

            System.out.println("Existing numbers: " + existingNumbers);

            // Find the next available number
            int nextNumber = 1;
            while (existingNumbers.contains(nextNumber)) {
                nextNumber++;

                if (nextNumber > 999) {
                    return Response.error("No available company code found (reached max limit)");
                }
            }

            String generatedCode = prefix + String.format("%02d", nextNumber);

            // Double check it doesn't exist (in case we missed it)
            if (existingCodes.contains(generatedCode)) {
                System.out.println("WARNING: " + generatedCode + " already exists in set!");
                // Try next number
                nextNumber++;
                generatedCode = prefix + String.format("%02d", nextNumber);
            }

            System.out.println("Generated unique code: " + generatedCode);
            dto.setCode(generatedCode);

            return Response.success(generatedCode);

        } catch (Exception e) {
            System.out.println("Error in generateSerialNo: " + e.getMessage());
            e.printStackTrace();
            return Response.error("Failed to generate serial number: " + e.getMessage());
        }
    }

    // =================== 6️⃣ DTO → ENTITY ===================
    @Override
    protected CompanyMst dtoToEntity(CompanyDTO dto) {
        CompanyMst company = new CompanyMst();

        // Set ALL fields - these are SETTER methods (they return void)
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

        // Handle company image path
        if (dto.getCompanyImagePath() != null) {
            company.setCompanyImage(dto.getCompanyImagePath());
        }

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
    @Transactional(rollbackFor = Exception.class)
    protected CompanyMst saveEntityInService(CompanyMst company, CompanyDTO dto) {
        try {
            System.out.println("=== SAVE ENTITY IN SERVICE STARTED ===");
            System.out.println("Company code: " + company.getCode());

            String savedImagePath = null;

            // ===== 1️⃣ SAVE IMAGE FIRST =====
            MultipartFile file = dto.getCompanyImage();
            if (file != null && !file.isEmpty()) {
                System.out.println("Saving company image...");
                try {
                    // Create directory if it doesn't exist
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                        System.out.println("Created upload directory: " + UPLOAD_DIR);
                    }

                    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path path = Paths.get(UPLOAD_DIR, filename);
                    Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                    savedImagePath = UPLOAD_DIR + filename;
                    company.setCompanyImage(savedImagePath);
                    System.out.println("✅ Image saved: " + savedImagePath);
                } catch (IOException e) {
                    System.err.println("❌ Failed to save company image: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Failed to save company image: " + e.getMessage(), e);
                }
            } else if (dto.getCompanyImagePath() != null) {
                savedImagePath = dto.getCompanyImagePath();
                company.setCompanyImage(savedImagePath);
                System.out.println("Using existing image path: " + savedImagePath);
            } else {
                System.out.println("No company image provided");
            }

            // ===== 2️⃣ SAVE MAIN COMPANY =====
            System.out.println("Saving company to database...");
            CompanyMst savedCompany = companyRepository.save(company);
            System.out.println("✅ Company saved with ID: " + savedCompany.getId());

            // ===== 3️⃣ SAVE AUTHORIZATION =====
            System.out.println("Saving authorization...");
            UserMst user = userRepository.findByUserCode(dto.getUserCode());
            if (user == null) {
                throw new RuntimeException("User not found with code: " + dto.getUserCode());
            }

            Authorization auth = new Authorization();
            auth.setMstId(savedCompany.getId());
            auth.setAuthorizationDate(dto.getAuthorizationDate());
            auth.setAuthorizationStatus(dto.getAuthorizationStatus());
            auth.setUserMst(user);
            Authorization savedAuth = authorizationRepository.save(auth);
            System.out.println("✅ Authorization saved with ID: " + savedAuth.getAuthId());

            // ===== 4️⃣ SAVE COMPANY LOG =====
            System.out.println("Saving company log...");

            CompanyLog log = new CompanyLog();

            // Copy ALL DATA FROM CompanyMst to CompanyLog
            log.setCompany(savedCompany.getCompany());
            log.setCode(savedCompany.getCode());
            log.setShortName(savedCompany.getShortName());
            log.setActiveDate(savedCompany.getActiveDate());
            log.setWithaffectdate(savedCompany.getWithaffectdate());
            log.setAddress(savedCompany.getAddress());
            log.setAddress1(savedCompany.getAddress1());
            log.setAddress2(savedCompany.getAddress2());
            log.setCountry(savedCompany.getCountry());
            log.setState(savedCompany.getState());
            log.setDistrict(savedCompany.getDistrict());
            log.setPlace(savedCompany.getPlace());
            log.setPincode(savedCompany.getPincode());
            log.setLatitude(savedCompany.getLatitude());
            log.setLongitude(savedCompany.getLongitude());
            log.setLandlineNumber(savedCompany.getLandlineNumber());
            log.setMobileNumber(savedCompany.getMobileNumber());
            log.setEmail(savedCompany.getEmail());
            log.setEmployerName(savedCompany.getEmployerName());
            log.setDesignation(savedCompany.getDesignation());
            log.setEmployerNumber(savedCompany.getEmployerNumber());
            log.setEmployerEmail(savedCompany.getEmployerEmail());
            log.setCompanyImage(savedCompany.getCompanyImage()); // This should have the image path

            // Set authorization (foreign key)
            log.setAuthorization(savedAuth);

            CompanyLog savedLog = companyLogRepository.save(log);
            System.out.println("✅ Company log saved with ID: " + savedLog.getId());

            // Verify the save
            Long logCount = companyLogRepository.count();
            System.out.println("Total company logs in DB: " + logCount);

            System.out.println("=== ALL ENTITIES SAVED SUCCESSFULLY ===");
            return savedCompany;

        } catch (Exception e) {
            System.err.println("❌ Error saving company and related entities: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error saving company and related entities: " + e.getMessage(), e);
        }
    }

    // =================== 9️⃣ UTILITY ===================
    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}