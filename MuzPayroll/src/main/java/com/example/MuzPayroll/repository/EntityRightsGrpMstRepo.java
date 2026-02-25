
package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.MuzPayroll.entity.EntityRightsGrpMst;
import com.example.MuzPayroll.entity.UserGrpMst;

@Repository
public interface EntityRightsGrpMstRepo extends JpaRepository<EntityRightsGrpMst, Long> {

    // Long findMaxErmUserGroupID();

    EntityRightsGrpMst save(EntityRightsGrpMst entity);

@Query("SELECT MAX(e.ErmEntityGroupID) FROM EntityRightsGrpMst e")
Long findMaxErmEntityRightsGroupID();


@Query(value = """
    SELECT e.*
    FROM entity_rights_grp_mst e
    JOIN entity_hierarchy_info eh
      ON e.erm_entity_hierarchyid = eh.ehi_business_groupid
    WHERE eh.ehi_entity_hierarchyid = :companyId
    AND (:activeStatusYN IS NULL OR e.erm_activeyn = :activeStatusYN)
    """, nativeQuery = true)
List<EntityRightsGrpMst> findEntityRightsGrpByStatus(
        @Param("companyId") Long companyId,
        @Param("activeStatusYN") Boolean activeStatusYN
);

@Query("""
    SELECT e FROM EntityRightsGrpMst e
    WHERE (:search IS NULL OR :search = '' OR
        LOWER(e.ErmCode) LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(e.ErmName) LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(e.ErmShortName) LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(e.ErmDesc) LIKE LOWER(CONCAT('%', :search, '%'))
    )
""")
Page<EntityRightsGrpMst> searchEntityRightsGroup(
        @Param("search") String search,
        Pageable pageable
);

}

