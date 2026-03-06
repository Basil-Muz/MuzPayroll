package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.SolutionMst;

@Repository
public interface SolutionRepository extends JpaRepository<SolutionMst, Long> {
            @Query(value = """
            SELECT *
            FROM solution_mst
            WHERE som_solutionid = :solutionMstId 
            """, nativeQuery = true)
    SolutionMst findBySolutionMstId(Long solutionMstId);

}
