package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.repository.UserRepository;
import com.example.MuzPayroll.service.MuzpayrollService;

@RestController
@CrossOrigin(origins = "*")
public class MuzPayrollController {

    @Autowired
    private MuzpayrollService muzpayrollService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/saveCompany")
    public ResponseEntity<String> saveCompany(@RequestBody CompanyMst company) {
        return muzpayrollService.saveCompany(company);
    }

    @PostMapping("/saveBranch")
    public ResponseEntity<String> saveBranch(@RequestBody BranchMst branch) {
        return muzpayrollService.save(branch);
    }

    @PostMapping("/saveLocation")
    public ResponseEntity<String> saveLocation(@RequestBody LocationMst location) {
        return muzpayrollService.save(location);
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<CompanyMst> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{companyId}/branches")
    public List<BranchMst> getAllBranch(@PathVariable Long companyId) {
        return muzpayrollService.getAllBranchByCompanyId(companyId);
    }

}
