package com.example.MuzPayroll.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpMstDTO;

@Repository
public interface EntityHierarchyInfoRepository extends JpaRepository<EntityHierarchyInfo, Long> {

    @Query(value = """
            SELECT ehi_branchid
            FROM entity_hierarchy_info
            WHERE ehi_locationid = :locationId
            """, nativeQuery = true)
    Long findBranchIdByLocationId(@Param("locationId") Long locationId);

        @Query(value = """
                SELECT em.etm_name
                FROM entity_hierarchy_info eh
				JOIN entity_mst em
				ON eh.ehi_entity_hierarchyid = em.etm_entityid
                WHERE eh.ehi_entity_hierarchyid = :entityId
                """, nativeQuery = true)
    String findEntityNameByEntityId(@Param("entityId") Long entityId);
    
@Query(value = """
    SELECT eh.ehi_business_groupid
    FROM entity_hierarchy_info eh
    WHERE eh.ehi_entity_hierarchyid = :entityHierarchyInfoID
    """, nativeQuery = true)
Optional<Long> findBusinessGroupIdByEntityHierarchyInfoId(
        @Param("entityHierarchyInfoID") Long entityHierarchyInfoID
);
Optional<EntityHierarchyInfo> findById(Long id);
    
}
