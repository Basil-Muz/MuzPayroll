package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityHierarchyInfo;

@Repository
public interface EntityHierarchyInfoRepository extends JpaRepository<EntityHierarchyInfo, Long> {

    @Query(value = """
            SELECT ehi_branchid
            FROM entity_hierarchy_info
            WHERE ehi_locationid = :locationId
            """, nativeQuery = true)
    Long findBranchIdByLocationId(@Param("locationId") Long locationId);
}
