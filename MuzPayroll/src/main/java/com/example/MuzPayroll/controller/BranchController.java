package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.entity.DTO.BranchDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.service.BranchService;

@RestController
@RequestMapping("/Branch")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @PostMapping("/save")
    public Response<BranchDTO> saveBranch(@ModelAttribute BranchDTO dto) {
        return branchService.saveWrapper(dto);
    }

    @GetMapping("/{companyId}/branches")
    public List<BranchMst> getAllBranch(@PathVariable Long companyId) {
        return branchService.getAllBranchByCompanyId(companyId);
    }

}
