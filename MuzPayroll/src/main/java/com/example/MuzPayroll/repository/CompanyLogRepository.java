package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyLogPK;

@Repository
public interface CompanyLogRepository extends JpaRepository<CompanyLog, CompanyLogPK> {
    long count();

    // @Query("SELECT c FROM CompanyLog c WHERE CAST(c.companyLogID AS string) LIKE CONCAT(:prefix, '%')")
    // List<CompanyLog> findAllByCompanyLogIDStartingWith(@Param("prefix") String prefix);

    // @Query("SELECT MAX(c.companyLogID) FROM CompanyLog c WHERE CAST(c.companyLogID AS string) LIKE CONCAT(:prefix, '%')")
    // Long findMaxByCompanyLogIDStartingWith(@Param("prefix") String prefix);
}
