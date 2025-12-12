package com.example.MuzPayroll.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.repository.BranchRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.LocationRepository;

@Service
public class MuzpayrollService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    BranchRepository branchRepository;

    @Autowired(required = true)
    private LocationRepository locationRepository;

    public Optional<CompanyMst> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public List<BranchMst> getAllBranchByCompanyId(Long companyId) {
        return branchRepository.findByCompanyEntity_Id(companyId);
    }

    public ResponseEntity<String> saveCompany(CompanyMst company) {
        try {
            System.out.println("Received Company: " + company);
            companyRepository.save(company);
            return ResponseEntity.ok("Company saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving location: " + e.getMessage());
        }
    }

    public ResponseEntity<String> save(BranchMst branch) {
        try {
            System.out.println("Received Branch: " + branch);
            branchRepository.save(branch);
            return ResponseEntity.ok("Branch saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving location: " + e.getMessage());
        }
    }

    public ResponseEntity<String> save(LocationMst location) {
        try {
            System.out.println("Received Location: " + location);
            locationRepository.save(location);
            return ResponseEntity.ok("Location saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving location: " + e.getMessage());
        }
    }

}
