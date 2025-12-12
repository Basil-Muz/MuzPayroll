package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.BranchLog;

@Repository
public interface BranchLogRepository extends JpaRepository<BranchLog, Long> {
    
}
