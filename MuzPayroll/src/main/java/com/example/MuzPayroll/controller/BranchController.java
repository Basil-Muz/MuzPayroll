package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.MuzPayroll.entity.BranchLog;
import com.example.MuzPayroll.entity.BranchLogPK;
import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.DTO.AmendListDTO;
import com.example.MuzPayroll.entity.DTO.BranchDTO;
import com.example.MuzPayroll.entity.DTO.FormListDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.BranchLogRepository;
import com.example.MuzPayroll.repository.BranchRepository;
import com.example.MuzPayroll.service.BranchService;

@RestController
@RequestMapping("/branch")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private BranchLogRepository branchLogRepository;

    @PostMapping("/save")
    public Response<BranchDTO> saveBranch(@ModelAttribute BranchDTO dto, @RequestParam String mode) {
        return branchService.saveWrapper(dto, mode);
    }

    @GetMapping("/company/{companyId}")
    public List<BranchMst> getAllBranch(@PathVariable Long companyId) {
        return branchService.getAllBranchByCompanyId(companyId);
    }

    // TO get the branch from branchMst by giving MstID
    @GetMapping("{branchMstID}")
    public ResponseEntity<BranchMst> getBranchById(
            @PathVariable @NonNull Long branchMstID) {

        return branchRepository.findById(branchMstID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // TO get the companyMst and the List of Logs y using MstID
    @GetMapping("/getamendlist/{branchMstID}")
    public ResponseEntity<BranchDTO> getBranchByMstId(@PathVariable Long branchMstID) {

        BranchDTO dto = branchService.getBranchWithLogs(branchMstID);
        return ResponseEntity.ok(dto);
    }

    // To get the Branch list based on Company
    @GetMapping("/branchlist/{companyId}")
    public ResponseEntity<List<FormListDTO>> getBranchList(
            @PathVariable Long companyId) {

        List<BranchMst> list = branchRepository.findByCompanyEntity_CompanyMstID(companyId);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getBranchMstID());
                    dto.setCode(entity.getCode());
                    dto.setName(entity.getBranch());
                    dto.setShortName(entity.getShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setStatus(entity.getActiveStatusYN());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getActiveStatusYN());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    // To get the Company list from the MST table
    @GetMapping("/activebranchlist/{companyId}")
    public ResponseEntity<List<FormListDTO>> getActiveBranchList(@PathVariable Long companyId) {

        List<BranchMst> list = branchRepository.findActiveBranchesByCompanyId(companyId);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getBranchMstID());
                    dto.setCode(entity.getCode());
                    dto.setName(entity.getBranch());
                    dto.setShortName(entity.getShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setStatus(entity.getActiveStatusYN());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getActiveStatusYN());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/inactivebranchlist/{companyId}")
    public ResponseEntity<List<FormListDTO>> getInactiveCompanyList(@PathVariable Long companyId) {

        List<BranchMst> list = branchRepository.findInactiveBranchesByCompanyId(companyId);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getBranchMstID());
                    dto.setCode(entity.getCode());
                    dto.setName(entity.getBranch());
                    dto.setShortName(entity.getShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setStatus(entity.getActiveStatusYN());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getActiveStatusYN());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    // TO get the Branch data from branchLog by giving MstID and rowno
    @GetMapping("/amend/{branchMstID}/{rowNo}")
    public ResponseEntity<BranchLog> getBranchLogById(
            @PathVariable Long branchMstID,
            @PathVariable Long rowNo) {

        BranchLogPK pk = new BranchLogPK();
        pk.setBranchMstID(branchMstID);
        pk.setRowNo(rowNo);

        return branchLogRepository.findById(pk)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // To get the amend list
    @GetMapping("/amend/{branchMstID}")
    public ResponseEntity<List<AmendListDTO>> getBranchLogs(
            @PathVariable Long branchMstID) {

        List<BranchLog> logs = branchLogRepository.findAllLogsByBranchMstID(branchMstID);

        if (logs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<AmendListDTO> response = logs.stream()
                .map(log -> {
                    AmendListDTO dto = new AmendListDTO();
                    dto.setMstID(log.getBranchLogPK().getBranchMstID());
                    dto.setRowNo(log.getBranchLogPK().getRowNo());
                    dto.setAmendNo(log.getAmendNo());
                    dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
                    dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

}
