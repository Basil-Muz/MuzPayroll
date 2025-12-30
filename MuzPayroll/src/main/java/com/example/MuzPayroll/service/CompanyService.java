package com.example.MuzPayroll.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
public class CompanyService extends MuzirisAbstractService<CompanyDTO, CompanyMst> {

    private static final String UPLOAD_DIR = "/home/basilraju/Documents/MUZ Payroll/MuzPayroll/Uploads/Company/";

    // Image validation constants
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp");

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
        return save(dto);
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
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<CompanyMst> entityPopulate(CompanyDTO dto) {
        List<String> errors = new ArrayList<>();

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        // ===== CREATE AUTHORIZATION =====
        // System.out.println("Creating authorization in entityPopulate...");

        Authorization auth = new Authorization();
        auth.setAuthorizationDate(dto.getAuthorizationDate());
        auth.setAuthorizationStatus(dto.getAuthorizationStatus());
        auth.setUserMst(user);

        // ===== CREATE COMPANY ENTITY =====
        CompanyMst company = dtoToEntity(dto);

        // Store authorization temporarily
        company.setAuthorization(auth);

        // System.out.println("✅ Entity created in entityPopulate");
        // System.out.println("=== ENTITY POPULATE END ===");

        return Response.success(company);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(CompanyDTO dto, CompanyMst entity) {
        // System.out.println("=== BUSINESS VALIDATION START ===");
        // System.out.println("Entity received in businessValidate: " + (entity != null
        // ? "Present" : "Null"));

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

            // Set in entity
            if (entity != null) {
                entity.setCompanyImage(imagePath);
                // System.out.println("✅ Image path set in entity during businessValidate: " +
                // imagePath);
            } else {
                System.out.println("⚠️ Entity is null, cannot set image path");
            }

            // System.out.println("✅ Image validated and processed:");
            // System.out.println(" - DTO image path: " + dto.getCompanyImagePath());
        } else if (imageValidationResult.isSuccess() && dto.getCompanyImagePath() != null) {
            // If using existing image path
            if (entity != null) {
                entity.setCompanyImage(dto.getCompanyImagePath());
                // System.out.println("✅ Using existing image path in entity: " +
                // dto.getCompanyImagePath());
            }
        }

        // System.out.println("=== BUSINESS VALIDATION END ===");

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
    public Response<String> generateSerialNo(CompanyDTO dto, CompanyMst entity) {
        try {
            // System.out.println("=== GENERATE SERIAL NO START ===");
            // System.out.println("Entity received in generateSerialNo: " + (entity != null
            // ? "Present" : "Null"));

            String prefix = "CM";

            // Generate new code
            Pageable pageable = PageRequest.of(0, 1);
            List<CompanyMst> companies = companyRepository.findLatestCompanyWithCMPrefix(pageable);

            String generatedCode;
            // System.out.println("Latest companies found: " + (companies != null ?
            // companies.size() : 0));

            if (companies == null || companies.isEmpty()) {
                generatedCode = prefix + "01";
                // System.out.println("No existing companies, starting with: " + generatedCode);
            } else {
                CompanyMst latestCompany = companies.get(0);
                String latestCode = latestCompany.getCode();
                // System.out.println("Latest company code: " + latestCode);

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
                // System.out.println("Generated next code: " + generatedCode);
            }

            // SET CODE IN BOTH DTO AND ENTITY
            dto.setCode(generatedCode);
            // System.out.println("Code set in DTO: " + generatedCode);

            if (entity != null) {
                entity.setCode(generatedCode);
                // System.out.println("✅ Code set in entity: " + generatedCode);
            } else {
                // System.err.println("⚠️ WARNING: Entity is null in generateSerialNo!");
            }

            // System.out.println("=== GENERATE SERIAL NO END ===");
            return Response.success(generatedCode);

        } catch (Exception e) {
            System.err.println("❌ ERROR in generateSerialNo: " + e.getMessage());
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
    protected CompanyMst dtoToEntity(CompanyDTO dto) {
        CompanyMst company = new CompanyMst();

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
            System.out.println("Setting company image in dtoToEntity: " + dto.getCompanyImagePath());
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
        dto.setWithaffectdate(entity.getWithaffectdate());
        return dto;
    }

    // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected CompanyMst saveEntityInService(CompanyMst company, CompanyDTO dto) {
        try {
            System.out.println("=== SAVE ENTITY IN SERVICE STARTED ===");
            System.out.println("Company code: " + company.getCode());
            System.out.println("Company image path: " + company.getCompanyImage());
            System.out.println("Company ID in memory: " + System.identityHashCode(company));

            // ===== 1️⃣ SAVE MAIN COMPANY FIRST =====
            System.out.println("Saving company to database...");
            CompanyMst savedCompany = companyRepository.save(company);
            System.out.println("✅ Company saved with ID: " + savedCompany.getId());

            // ===== 2️⃣ SAVE AUTHORIZATION WITH COMPANY ID =====
            System.out.println("Saving authorization...");

            // Get the authorization created in entityPopulate
            Authorization auth = company.getAuthorization();
            if (auth == null) {
                // Fallback: create new authorization if not set
                System.out.println("⚠️ Authorization not found in company, creating new...");
                UserMst user = userRepository.findByUserCode(dto.getUserCode());
                if (user == null) {
                    throw new RuntimeException("User not found with code: " + dto.getUserCode());
                }

                auth = new Authorization();
                auth.setAuthorizationDate(dto.getAuthorizationDate());
                auth.setAuthorizationStatus(dto.getAuthorizationStatus());
                auth.setUserMst(user);
            }

            // Set the company ID
            auth.setMstId(savedCompany.getId());

            // Save the authorization
            Authorization savedAuth = authorizationRepository.save(auth);
            System.out.println("✅ Authorization saved with ID: " + savedAuth.getAuthId());
            System.out.println("✅ Company ID in authorization: " + savedAuth.getMstId());
            System.out.println("✅ Authorization Date: " + savedAuth.getAuthorizationDate());
            System.out.println("✅ Authorization Status: " + savedAuth.getAuthorizationStatus());

            // ===== 3️⃣ SAVE COMPANY LOG =====
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
            log.setCompanyImage(savedCompany.getCompanyImage());

            // Set authorization (with date and status)
            log.setAuthorization(savedAuth);

            CompanyLog savedLog = companyLogRepository.save(log);
            System.out.println("✅ Company log saved with ID: " + savedLog.getId());

            System.out.println("=== ALL ENTITIES SAVED SUCCESSFULLY ===");
            return savedCompany;

        } catch (Exception e) {
            System.err.println("❌ Error saving company and related entities: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error saving company and related entities: " + e.getMessage(), e);
        }
    }

    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    // =================== 🔟 IMAGE VALIDATION AND PROCESSING ===================
    private Response<String> validateAndProcessImage(CompanyDTO dto) {
        System.out.println("=== VALIDATE AND PROCESS IMAGE START ===");
        MultipartFile file = dto.getCompanyImage();

        // If no new image uploaded and no existing image path, image is required
        // if ((file == null || file.isEmpty()) && isEmpty(dto.getCompanyImagePath())) {
        // System.out.println("❌ No image provided");
        // return Response.error("Company image is required");
        // }

        // If new image is uploaded, validate and process it
        if (file != null && !file.isEmpty()) {
            System.out.println("Processing new image upload...");

            // Validate image file
            List<String> imageErrors = validateImageFile(file);
            if (!imageErrors.isEmpty()) {
                String errorMessage = String.join("; ", imageErrors);
                System.out.println("❌ Image validation failed: " + errorMessage);
                return Response.error(errorMessage);
            }

            // Save the image and get the path
            try {
                String imagePath = saveImageFile(file);
                System.out.println("✅ Image saved: " + imagePath);
                System.out.println("=== VALIDATE AND PROCESS IMAGE END ===");
                return Response.success(imagePath);

            } catch (IOException e) {
                System.err.println("❌ Failed to save company image: " + e.getMessage());
                return Response.error("Failed to save company image: " + e.getMessage());
            }
        }

        // If existing image path is provided, validate it exists
        if (!isEmpty(dto.getCompanyImagePath())) {
            Path existingPath = Paths.get(dto.getCompanyImagePath());
            if (!Files.exists(existingPath)) {
                System.out.println("❌ Existing image not found: " + dto.getCompanyImagePath());
                return Response.error("Existing company image not found at path: " + dto.getCompanyImagePath());
            }
            System.out.println("✅ Using existing image path: " + dto.getCompanyImagePath());
            System.out.println("=== VALIDATE AND PROCESS IMAGE END ===");
            return Response.success(dto.getCompanyImagePath());
        }

        System.out.println("=== VALIDATE AND PROCESS IMAGE END ===");
        return Response.success(null);
    }

    // Validate image file
    private List<String> validateImageFile(MultipartFile file) {
        List<String> errors = new ArrayList<>();

        // if (file == null || file.isEmpty()) {
        // errors.add("Image file is empty");
        // return errors;
        // }

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
        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("Created upload directory: " + UPLOAD_DIR);
        }

        // Get original filename and extension
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate unique filename with original extension
        String filename = UUID.randomUUID() + fileExtension;
        Path path = Paths.get(UPLOAD_DIR, filename);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        String imagePath = UPLOAD_DIR + filename;
        System.out.println("✅ Image saved: " + imagePath);
        System.out.println("✅ Image size: " + file.getSize() + " bytes");
        System.out.println("✅ Image type: " + file.getContentType());

        return imagePath;
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
}