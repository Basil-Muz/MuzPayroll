package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.CompanyMst;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyMst, Long> {

    boolean existsByCode(String code);

    // This is what you were using before:
    CompanyMst findTopByCodeStartingWithOrderByCodeDesc(String prefix);
    
    
    // OR add this query method:
    @Query("SELECT c FROM CompanyMst c WHERE c.code LIKE :prefix% ORDER BY c.code DESC")
    List<CompanyMst> findByCodeStartingWith(@Param("prefix") String prefix);
    
}