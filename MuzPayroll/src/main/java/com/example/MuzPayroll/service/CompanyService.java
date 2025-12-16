package com.example.MuzPayroll.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String UPLOAD_DIR = "/home/basilraju/Documents/MUZ Payroll/MuzPayroll/src/main/resources/Uploads/Company/";

    public ResponseEntity<String> saveCompany(Map<String, String> data, MultipartFile companyImage) {

        try {
            // ----------------- Image Validation -----------------
            // if (companyImage == null || companyImage.isEmpty()) {
            // return ResponseEntity.badRequest().body("Company image is required");
            // }

            // Create folder if not exists
            String imagePath = null;

            if (companyImage != null && !companyImage.isEmpty()) {

                Files.createDirectories(Paths.get(UPLOAD_DIR));

                String fileName = UUID.randomUUID() + "_" + companyImage.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR, fileName);

                Files.copy(
                        companyImage.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING);

                imagePath = UPLOAD_DIR + fileName;
            }

            // ----------------- Required Field Checks -----------------
            if (data.get("authorizationDate") == null ||
                    data.get("authorizationStatus") == null ||
                    data.get("user_code") == null) {

                return ResponseEntity.badRequest().body("Missing authorization data");
            }

            // ----------------- Save Company -----------------
            CompanyMst company = objectMapper.convertValue(data, CompanyMst.class);

            // Save image path
            company.setCompanyImage(imagePath);

            CompanyMst savedCompany = companyRepository.save(company);

            // ----------------- Save Authorization -----------------
            Authorization auth = new Authorization();
            auth.setMstId(savedCompany.getId());
            auth.setAuthorizationDate(LocalDate.parse(data.get("authorizationDate")));

            int statusInt = Integer.parseInt(data.get("authorizationStatus"));
            if (statusInt != 0 && statusInt != 1) {
                return ResponseEntity.badRequest().body("authorizationStatus must be 0 or 1");
            }

            auth.setAuthorizationStatus(statusInt == 1);

            UserMst user = userRepository.findByUserCode(data.get("user_code"));
            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid user_code");
            }

            auth.setUserMst(user);
            Authorization savedAuth = authorizationRepository.save(auth);

            // ----------------- Save Company Log -----------------
            CompanyLog log = objectMapper.convertValue(data, CompanyLog.class);
            log.setAuthorization(savedAuth);
            companyLogRepository.save(log);

            return ResponseEntity.ok("Company saved successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error saving company: " + e.getMessage());
        }
    }
}
