package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.UserEntityDTO;
import com.example.MuzPayroll.service.EntityService;

@RestController
@RequestMapping("/entity")
@CrossOrigin(origins = "*")
public class EntityController {

    @Autowired
    private EntityService entityService;

    @GetMapping("/fetchCompany")
    public List<UserEntityDTO> getUserCompany(
            @RequestParam Integer userId) {

        return entityService.getUserEntities(userId, 13);
    }

    @GetMapping("/fetchBranch")
    public List<UserEntityDTO> getUserBranch(
            @RequestParam Integer userId,
            @RequestParam Integer companyId) {

        return entityService.getUserBranch(userId, companyId, 14);
    }

    @GetMapping("/fetchLocation")
    public List<UserEntityDTO> getUserLocation(
            @RequestParam Integer userId,
            @RequestParam Integer branchId) {

        return entityService.getUserLocation(userId, branchId, 15);
    }

}
