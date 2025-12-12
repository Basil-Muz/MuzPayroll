package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchLog;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationLog;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.BranchLogRepository;
import com.example.MuzPayroll.repository.BranchRepository;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.LocationLogRepository;
import com.example.MuzPayroll.repository.LocationRepository;
import com.example.MuzPayroll.repository.UserRepository;

import tools.jackson.databind.ObjectMapper;

@Service
public class MuzpayrollService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired 
    private BranchLogRepository branchLogRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private LocationLogRepository locationLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired(required = true)
    private LocationRepository locationRepository;

    public Optional<CompanyMst> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public List<BranchMst> getAllBranchByCompanyId(Long companyId) {
        return branchRepository.findByCompanyEntity_Id(companyId);
    }

    public ResponseEntity<String> saveCompany(Map<String, Object> data) {

        try {
            // Validate required fields first
            if (data.get("authorizationDate") == null) {
                return ResponseEntity.badRequest().body("authorizationDate is required");
            }
            if (data.get("authorizationStatus") == null) {
                return ResponseEntity.badRequest().body("authorizationStatus is required (0 or 1)");
            }
            if (data.get("user_code") == null) {
                return ResponseEntity.badRequest().body("user_code is required");
            }

            // Convert JSON → CompanyMst
            CompanyMst company = objectMapper.convertValue(data, CompanyMst.class);
            CompanyMst savedCompany = companyRepository.save(company);

            // Create Authorization
            Authorization auth = new Authorization();
            auth.setMstId(savedCompany.getId());

            // Parse date safely
            String dateStr = data.get("authorizationDate").toString();
            auth.setAuthorizationDate(LocalDate.parse(dateStr));

            // Parse status safely
            String statusVal = data.get("authorizationStatus").toString();
            int statusInt = Integer.parseInt(statusVal);

            if (statusInt != 0 && statusInt != 1) {
                return ResponseEntity.badRequest().body("authorizationStatus must be ONLY 0 or 1");
            }

            auth.setAuthorizationStatus(statusInt == 1);

            // Load UserMst safely
            String userStr = data.get("user_code").toString();
            String userCode = String.valueOf(userStr);

            UserMst user = userRepository.findByUserCode(userCode);
            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid user_code: " + userCode);
            }

            auth.setUserMst(user);

            // Save authorization
            Authorization savedAuth = authorizationRepository.save(auth);

            // Create CompanyLog
            CompanyLog log = objectMapper.convertValue(data, CompanyLog.class);
            log.setAuthorization(savedAuth); // Many-to-One
            companyLogRepository.save(log);

            return ResponseEntity.ok("Company saved successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving company: " + e.getMessage());
        }
    }

    public ResponseEntity<String> saveBranch(Map<String, Object> data) {

        try {
            // Convert JSON → BranchMst
            BranchMst branch = objectMapper.convertValue(data, BranchMst.class);

            // Save Branch
            BranchMst savedBranch = branchRepository.save(branch);

            // Create Authorization record
            Authorization auth = new Authorization();
            auth.setMstId(savedBranch.getId());

            // Parse Date
            auth.setAuthorizationDate(LocalDate.parse(data.get("authorizationDate").toString()));

            // --- Handle authorizationStatus (must be 0 or 1) ---
            Object statusObj = data.get("authorizationStatus");
            if (statusObj == null) {
                return ResponseEntity.badRequest().body("authorizationStatus is required (0 or 1)");
            }

            int statusInt = Integer.parseInt(statusObj.toString());
            if (statusInt != 0 && statusInt != 1) {
                return ResponseEntity.badRequest().body("authorizationStatus must be ONLY 0 or 1");
            }

            auth.setAuthorizationStatus(statusInt == 1); // store as boolean true/false

            // --- Load UserMst ---
            String userCode = String.valueOf(data.get("user_code").toString());
            UserMst user = userRepository.findByUserCode(userCode);

            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid user_code: " + userCode);
            }

            auth.setUserMst(user);

            // Save authorization record
            Authorization savedAuth = authorizationRepository.save(auth);

            // 3. Create and save BranchLog

            BranchLog log = objectMapper.convertValue(data, BranchLog.class);

            // Set the ManyToOne relationship
            log.setAuthorization(savedAuth);

            // Save log (new row)
            branchLogRepository.save(log);

            return ResponseEntity.ok("Branch saved successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving Branch: " + e.getMessage());
        }
    }

    public ResponseEntity<String> saveLocation(Map<String, Object> data) {

        try {
            // Convert JSON → LocationMst
            LocationMst location = objectMapper.convertValue(data, LocationMst.class);

            // Save Location
            LocationMst savedLocation = locationRepository.save(location);

            // Create Authorization record
            Authorization auth = new Authorization();
            auth.setMstId(savedLocation.getId());

            // Parse Date
            auth.setAuthorizationDate(LocalDate.parse(data.get("authorizationDate").toString()));

            // --- Handle authorizationStatus (must be 0 or 1) ---
            Object statusObj = data.get("authorizationStatus");
            if (statusObj == null) {
                return ResponseEntity.badRequest().body("authorizationStatus is required (0 or 1)");
            }

            int statusInt = Integer.parseInt(statusObj.toString());
            if (statusInt != 0 && statusInt != 1) {
                return ResponseEntity.badRequest().body("authorizationStatus must be ONLY 0 or 1");
            }

            auth.setAuthorizationStatus(statusInt == 1); // store as boolean true/false

            // --- Load UserMst ---
            String userCode = String.valueOf(data.get("user_code").toString());
            UserMst user = userRepository.findByUserCode(userCode);

            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid user_code: " + userCode);
            }

            auth.setUserMst(user);

            // Save authorization record
            Authorization savedAuth = authorizationRepository.save(auth);

            // 3. Create and save LocationLog

            LocationLog log = objectMapper.convertValue(data, LocationLog.class);

            // Set the ManyToOne relationship
            log.setAuthorization(savedAuth);

            // Save log (new row)
            locationLogRepository.save(log);

            return ResponseEntity.ok("Location saved successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving Location: " + e.getMessage());
        }
    }

}
