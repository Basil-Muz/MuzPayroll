package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.StatusUpdateDTO;
import com.example.MuzPayroll.entity.DTO.UserEntityDTO;
import com.example.MuzPayroll.service.OptionMstService;

@RestController
@RequestMapping("/option")
@CrossOrigin(origins = "*")
public class OptionMstController {

    @Autowired
    private OptionMstService optionMstService;

    @GetMapping("/fetchOption")
    public List<StatusUpdateDTO> getUserBranch(
            @RequestParam Long userId) {

        return optionMstService.getOptions(userId);
    }
}


