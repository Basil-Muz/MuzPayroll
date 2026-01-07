package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchLog;
import com.example.MuzPayroll.entity.BranchMst;

import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.BranchLogRepository;
import com.example.MuzPayroll.repository.BranchRepository;

import com.example.MuzPayroll.repository.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private BranchLogRepository branchLogRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<BranchMst> getAllBranchByCompanyId(Long companyId) {
        return branchRepository.findByCompanyEntity_CompanyMstID(companyId);
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

}
