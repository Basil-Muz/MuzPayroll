package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.BranchMst;

@Repository
public interface BranchRepository extends JpaRepository<BranchMst, Long> {

    List<BranchMst> findByCompanyEntity_CompanyMstID(Long companyId);

    boolean existsByCode(String code);

    /**
     * Get the LATEST company with BR prefix using Pageable
     * Pageable allows us to get only ONE record (LIMIT 1 equivalent)
     */
    @Query("SELECT c FROM BranchMst c WHERE c.code LIKE 'BR%' ORDER BY c.id DESC")
    List<BranchMst> findLatestBranchWithBRPrefix(Pageable pageable);

    @Query("SELECT COUNT(c) > 0 FROM BranchMst c WHERE c.branchMstID = :branchMstID")
    boolean existsByBranchMstID(@Param("branchMstID") Long branchMstID);

    // Using auto-increment ID (assumes latest has highest ID)
    @Query("SELECT c FROM BranchMst c WHERE c.branchMstID = :branchMstID " +
            "ORDER BY c.id DESC LIMIT 1")
    Optional<BranchMst> findLatestById(@Param("branchMstID") Long branchMstID);

    // Find maximum ID
    @Query("SELECT MAX(c.branchMstID) FROM BranchMst c WHERE c.branchMstID >= 200000")
    Long findMaxBranchMstID();

}
