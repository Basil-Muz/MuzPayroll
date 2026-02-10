package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.SolutionMst;
import com.example.MuzPayroll.service.SolutionService;

@RestController
@RequestMapping("/solution")
@CrossOrigin(origins = "*")
public class SolutionController {

    @Autowired
    private SolutionService SolutionService;

    @GetMapping("/fetchSolution")
    public List<SolutionMst> getSolutionMst() {
        return SolutionService.getSolution();
    }
}
