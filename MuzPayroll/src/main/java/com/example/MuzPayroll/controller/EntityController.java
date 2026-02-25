package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.MuzPayroll.entity.DTO.EntityMstDTO;
import com.example.MuzPayroll.entity.DTO.FormListDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserEntityDTO;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.repository.EntityRepository;
import com.example.MuzPayroll.service.EntityService;

@RestController
@RequestMapping("/entity")
@CrossOrigin(origins = "*")
public class EntityController {

    @Autowired
    private EntityService entityService;

    @Autowired
    private EntityRepository entityRepository;

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response<EntityMstDTO> saveCompany(
            @ModelAttribute EntityMstDTO dto, // ← This will bind ALL form fields to DTO
            @RequestParam(value = "entityImage", required = false) MultipartFile entityImage,
            @RequestParam String mode) {

        try {
            dto.setEtmImage(entityImage);
            return entityService.saveWrapper(dto, mode);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.error("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/fetchCompany")
    public List<UserEntityDTO> getUserCompany(
            @RequestParam Long userId) {

        return entityService.getCompany(userId, 13L);
    }

    // To get the Company list from the MST table
    @GetMapping("/companylist")
    public ResponseEntity<List<FormListDTO>> getCompanyList(
            @RequestParam(required = false) Boolean activeStatusYN) {

        List<EntityMst> list = entityRepository.findCompanyByStatus(activeStatusYN);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getEtmEntityId());
                    dto.setCode(entity.getEtmCode());
                    dto.setName(entity.getEtmName());
                    dto.setShortName(entity.getEtmShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getEtmActiveYN());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/fetchBranch")
    public List<UserEntityDTO> getUserBranch(
            @RequestParam Long userId,
            @RequestParam Long companyId) {

        return entityService.getUserBranch(userId, companyId, 14L);
    }

    // To get the branch list from the MST table
    @GetMapping("/branchlist")
    public ResponseEntity<List<FormListDTO>> getBranchList(
            @RequestParam(required = false) Boolean activeStatusYN,
            @RequestParam Long companyId) {

        List<EntityMst> list = entityRepository.findBranchByStatus(activeStatusYN, companyId);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getEtmEntityId());
                    dto.setCode(entity.getEtmCode());
                    dto.setName(entity.getEtmName());
                    dto.setShortName(entity.getEtmShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getEtmActiveYN());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/fetchLocation")
    public List<UserEntityDTO> getUserLocation(
            @RequestParam Long userId,
            @RequestParam Long branchId,
            @RequestParam Long companyId) {

        return entityService.getUserLocation(userId, companyId, branchId, 15L);
    }

    // To get the location list from the MST table
    @GetMapping("/locationlist")
    public ResponseEntity<List<FormListDTO>> getLocationList(
            @RequestParam(required = false) Boolean activeStatusYN,
            @RequestParam Long companyId,
            @RequestParam(required = false) Long branchId) {

        List<EntityMst> list = entityRepository.findLocationByStatus(activeStatusYN, companyId, branchId);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getEtmEntityId());
                    dto.setCode(entity.getEtmCode());
                    dto.setName(entity.getEtmName());
                    dto.setShortName(entity.getEtmShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getEtmActiveYN());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

}
