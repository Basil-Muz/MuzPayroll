package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.CompanyLogPK;

@Repository
public interface CompanyLogRepository extends JpaRepository<CompanyLog, CompanyLogPK> {
    long count();

    @Query("""
                SELECT MAX(c.companyLogPK.rowNo)
                FROM CompanyLog c
                WHERE c.companyLogPK.companyMstID = :companyMstID
            """)
    Long findMaxRowNo(@Param("companyMstID") Long companyMstID);

}
