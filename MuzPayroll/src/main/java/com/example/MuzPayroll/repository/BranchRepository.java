package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.BranchMst;

@Repository
public interface BranchRepository extends JpaRepository<BranchMst, Long> {
    List<BranchMst> findByCompanyEntity_CompanyMstID(Long companyId); 
}

