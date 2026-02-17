package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityGrpRightsLink;

@Repository
public interface EntityGrpRightsLinkRepository extends JpaRepository<EntityGrpRightsLink, Long> {

    @Query(value = """
            SELECT
                eh.ehi_entity_hierarchyid,
                e.etm_name AS parent_name,
                em.etm_name AS location_name,
                eg.erm_name
            FROM entity_hierarchy_info eh
            JOIN entity_mst em
                ON eh.ehi_locationid = em.etm_entityid
            JOIN entity_grp_rights_link er
                ON eh.ehi_entity_hierarchyid = er.egl_entity_hierarchyid
            JOIN entity_rights_grp_mst eg
                ON eg.erm_entity_groupid = er.egl_entity_group_rightsid
            JOIN entity_mst e
                ON e.etm_entityid = eh.ehi_parent_entity_hierarchyid
            WHERE eh.ehi_branchid = ANY(:branchid)
              AND er.egl_solutionid = :solutionid
            """, nativeQuery = true)
    List<Object[]> getEntityGrpRightsLinkData(
            @Param("solutionid") Long solutionid,
            @Param("branchid") Long[] branchid);

}
