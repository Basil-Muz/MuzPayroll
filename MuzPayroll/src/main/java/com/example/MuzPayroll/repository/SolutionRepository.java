package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.SolutionMst;

@Repository
public interface SolutionRepository extends JpaRepository<SolutionMst, Long> {

}
