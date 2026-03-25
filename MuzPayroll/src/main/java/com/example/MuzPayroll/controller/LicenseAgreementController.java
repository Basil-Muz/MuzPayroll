package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.LicenseAgreement;
import com.example.MuzPayroll.entity.DTO.EntityGrpLinkDTO;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsLinkDTO;
import com.example.MuzPayroll.entity.DTO.LicenseAgreementDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.LicenseAgreementRepository;
import com.example.MuzPayroll.service.LicenseAgreementService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/licenseagreement")
public class LicenseAgreementController {

    @Autowired
    private LicenseAgreementRepository licenseAgreementRepository;

    @Autowired
    private LicenseAgreementService licenseAgreementService;

    @PostMapping("/save")
    public Response<LicenseAgreementDTO> save(@ModelAttribute LicenseAgreementDTO dto) {
        return licenseAgreementService.saveWrapper(dto, "INSERT");
    }

    @GetMapping("/getdata")
    public ResponseEntity<List<LicenseAgreementDTO>> getLicenseAgreementS(
            @RequestParam Long companyId) {

        List<LicenseAgreementDTO> result = licenseAgreementService.getData(companyId);

        return ResponseEntity.ok(result);
    }
}
