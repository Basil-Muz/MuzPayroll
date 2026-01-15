package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

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

        @Query(value = """
                        SELECT MAX(CAST(amend_no AS INTEGER))
                        FROM company_log
                        WHERE company_mstid = :companyMstID
                        AND amend_no ~ '^[0-9]+$'
                        """, nativeQuery = true)
        Optional<Long> findLatestAmendNoByMstId(@Param("companyMstID") Long companyMstID);

        @Query(value = """
                        SELECT *
                        FROM company_log
                        WHERE company_mstid = :companyMstID
                        AND amend_no ~ '^[0-9]+$'
                        ORDER BY CAST(amend_no AS INTEGER) DESC
                        """, nativeQuery = true)
        List<CompanyLog> findAllLogsByCompanyMstID(@Param("companyMstID") Long companyMstID);

}
