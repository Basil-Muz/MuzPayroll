package com.example.MuzPayroll.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.service.CompanyService;

@RestController
@CrossOrigin(origins = "*")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    // @PostMapping("/saveCompany")
    // public ResponseEntity<String> saveCompany(@RequestBody Map<String, Object>
    // data) {
    // return companyService.saveCompany(data);
    // }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> saveCompany(
            @RequestParam Map<String, String> data,
            @RequestParam(value = "companyImage", required = false) MultipartFile companyImage) {

        return companyService.saveCompany(data, companyImage);
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<CompanyMst> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
