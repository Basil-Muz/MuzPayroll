package com.example.MuzPayroll.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.BranchMst;
import com.example.MuzPayroll.service.BranchService;

@RestController
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @PostMapping("/saveBranch")
    public ResponseEntity<String> saveBranch(@RequestBody Map<String, Object> data) {
        return branchService.saveBranch(data);
    }

    @GetMapping("/{companyId}/branches")
    public List<BranchMst> getAllBranch(@PathVariable Long companyId) {
        return branchService.getAllBranchByCompanyId(companyId);
    }

}
