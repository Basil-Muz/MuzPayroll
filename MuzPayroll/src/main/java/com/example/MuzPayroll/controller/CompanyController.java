package com.example.MuzPayroll.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.repository.CompanyRepository;
import com.example.MuzPayroll.service.CompanyService;

@RestController
@RequestMapping("/company")
@CrossOrigin(origins = "*")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response<CompanyDTO> saveCompany(
            @ModelAttribute CompanyDTO dto, // ← This will bind ALL form fields to DTO
            @RequestParam(value = "companyImage", required = false) MultipartFile companyImage) {

        try {
            // Set the uploaded file
            dto.setCompanyImage(companyImage);

            // Call your service
            return companyService.saveWrapper(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.error("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<CompanyMst> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
