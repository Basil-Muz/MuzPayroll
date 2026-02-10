package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.SolutionMst;
import com.example.MuzPayroll.repository.SolutionRepository;

@Service
public class SolutionService {

    @Autowired
    private SolutionRepository solutionRepository;

    public List<SolutionMst> getSolution() {
        return solutionRepository.findAll();
    }
}
