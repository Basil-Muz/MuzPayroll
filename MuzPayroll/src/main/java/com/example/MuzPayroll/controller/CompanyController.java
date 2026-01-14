package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyLogPK;
import com.example.MuzPayroll.entity.CompanyMst;
import com.example.MuzPayroll.entity.DTO.AmendListDTO;
import com.example.MuzPayroll.entity.DTO.CompanyDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.CompanyLogRepository;
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

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response<CompanyDTO> saveCompany(
            @ModelAttribute CompanyDTO dto, // ← This will bind ALL form fields to DTO
            @RequestParam(value = "companyImage", required = false) MultipartFile companyImage,
            @RequestParam String mode) {

        try {
            dto.setCompanyImage(companyImage);
            return companyService.saveWrapper(dto, mode);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.error("Error processing request: " + e.getMessage());
        }
    }

    // TO get the companyMst by giving MstID
    @GetMapping("{companyMstID}")
    public ResponseEntity<CompanyMst> getCompanyById(
            @PathVariable @NonNull Long companyMstID) {

        return companyRepository.findById(companyMstID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // TO get the company data from companyLog by giving MstID and rowno
    @GetMapping("/amend/{companyMstID}/{rowNo}")
    public ResponseEntity<CompanyLog> getCompanyLogById(
            @PathVariable Long companyMstID,
            @PathVariable Long rowNo) {

        CompanyLogPK pk = new CompanyLogPK();
        pk.setCompanyMstID(companyMstID);
        pk.setRowNo(rowNo);

        return companyLogRepository.findById(pk)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // To get the amend list
    @GetMapping("amend/{companyMstID}")
    public ResponseEntity<List<AmendListDTO>> getCompanyLogs(
            @PathVariable Long companyMstID) {

        List<CompanyLog> logs = companyLogRepository.findAllLogsByCompanyMstID(companyMstID);

        if (logs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<AmendListDTO> response = logs.stream()
                .map(log -> {
                    AmendListDTO dto = new AmendListDTO();
                    dto.setMstID(log.getCompanyLogPK().getCompanyMstID());
                    dto.setRowNo(log.getCompanyLogPK().getRowNo());
                    dto.setAmendNo(log.getAmendNo());
                    dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
                    dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

}