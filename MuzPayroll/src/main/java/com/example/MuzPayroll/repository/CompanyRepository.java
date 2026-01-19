package com.example.MuzPayroll.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.MuzPayroll.entity.CompanyMst;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyMst, Long> {

    boolean existsByCode(String code);

    Optional<CompanyMst> findByCode(String code);

    /**
     * Get the LATEST company with CM prefix using Pageable
     * Pageable allows us to get only ONE record (LIMIT 1 equivalent)
     */
    @Query("SELECT c FROM CompanyMst c WHERE c.code LIKE 'CM%' ORDER BY c.id DESC")
    List<CompanyMst> findLatestCompanyWithCMPrefix(Pageable pageable);

    @Query("SELECT COUNT(c) > 0 FROM CompanyMst c WHERE c.companyMstID = :companyMstID")
    boolean existsByCompanyMstID(@Param("companyMstID") Long companyMstID);

    // Using auto-increment ID (assumes latest has highest ID)
    @Query("SELECT c FROM CompanyMst c WHERE c.companyMstID = :companyMstID " +
            "ORDER BY c.id DESC LIMIT 1")
    Optional<CompanyMst> findLatestById(@Param("companyMstID") Long companyMstID);

    // Find maximum ID
    @Query("SELECT MAX(c.companyMstID) FROM CompanyMst c WHERE c.companyMstID >= 100000")
    Long findMaxCompanyMstID();

    @Query("SELECT a.code FROM CompanyMst a WHERE a.companyMstID = :companyMstID")
    Optional<String> findCodeByMstId(@Param("companyMstID") Long companyMstID);

    @Query("SELECT c FROM CompanyMst c")
    List<CompanyMst> findAllCompany();

    @EntityGraph(attributePaths = "companyLogs")
    Optional<CompanyMst> findWithLogsByCompanyMstID(Long id);

    @Query("SELECT c FROM CompanyMst c WHERE c.activeStatusYN = true")
    List<CompanyMst> findAllActiveCompanies();

    @Query("SELECT c FROM CompanyMst c WHERE c.activeStatusYN = false")
    List<CompanyMst> findAllInActiveCompanies();
}
