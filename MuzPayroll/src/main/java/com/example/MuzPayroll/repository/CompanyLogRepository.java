package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.CompanyLog;

@Repository
public interface CompanyLogRepository extends JpaRepository<CompanyLog, Long> {
    
}
