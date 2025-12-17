package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.CompanyMst;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyMst, Long> {

    boolean existsByCode(String code);

    // Fetch latest company by code descending
    CompanyMst findTopByCodeStartingWithOrderByCodeDesc(String prefix);
}