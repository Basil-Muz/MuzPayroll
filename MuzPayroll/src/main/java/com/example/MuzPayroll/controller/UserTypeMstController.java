package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.UserTypeMst;
import com.example.MuzPayroll.entity.DTO.AmendListDTO;
import com.example.MuzPayroll.repository.UserTypeMstRepository;
import com.example.MuzPayroll.service.UserTypeMstService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin("*")
@RequestMapping("/userType")
public class UserTypeMstController {
    
    @Autowired
    private UserTypeMstRepository userTypeMstRepository;

    @Autowired
    private UserTypeMstService userTypeMstService;

    @GetMapping("/getAllTypes")
    public List<UserTypeMst> getMethodName() {
        return userTypeMstRepository.findByUtmUserTypeIDNot();
    }
    
}
