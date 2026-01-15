package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

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

        @Query(value = """
                        SELECT MAX(CAST(amend_no AS INTEGER))
                        FROM branch_log
                        WHERE branch_mstid = :branchMstID
                        AND amend_no ~ '^[0-9]+$'
                        """, nativeQuery = true)
        Optional<Long> findLatestAmendNoByMstId(@Param("branchMstID") Long branchMstID);

        @Query(value = """
                        SELECT *
                        FROM branch_log
                        WHERE branch_mstid = :branchMstID
                        AND amend_no ~ '^[0-9]+$'
                        ORDER BY CAST(amend_no AS INTEGER) DESC
                        """, nativeQuery = true)
        List<BranchLog> findAllLogsByBranchMstID(@Param("branchMstID") Long branchMstID);

}
