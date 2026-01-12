package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.BranchLog;
import com.example.MuzPayroll.entity.BranchLogPK;

@Repository
public interface BranchLogRepository extends JpaRepository<BranchLog, BranchLogPK> {

    @Query("""
                SELECT MAX(c.branchLogPK.rowNo)
                FROM BranchLog c
                WHERE c.branchLogPK.branchMstID = :branchMstID
            """)
    Long findMaxRowNo(@Param("branchMstID") Long branchMstID);
}
