package com.example.MuzPayroll.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.MuzPayroll.entity.CompanyMst;
import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyMst, Long> {

    boolean existsByCode(String code);

    /**
     * Get the LATEST company with CM prefix using Pageable
     * Pageable allows us to get only ONE record (LIMIT 1 equivalent)
     */
    @Query("SELECT c FROM CompanyMst c WHERE c.code LIKE 'CM%' ORDER BY c.id DESC")
    List<CompanyMst> findLatestCompanyWithCMPrefix(Pageable pageable);
}