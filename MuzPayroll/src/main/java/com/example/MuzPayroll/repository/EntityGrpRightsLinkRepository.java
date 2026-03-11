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
                er.entity_grp_rights_linkid AS linkId,
                e.etm_entityid AS branchId,
                e.etm_name AS branchName,
                eh.ehi_entity_hierarchyid AS locationId,
                em.etm_name AS locationName,
                eg.erm_entity_groupid AS groupId
            FROM entity_hierarchy_info eh
            LEFT JOIN entity_mst em
                ON eh.ehi_locationid = em.etm_entityid
            LEFT JOIN entity_grp_rights_link er
                ON eh.ehi_entity_hierarchyid = er.egl_entity_hierarchyid
                AND er.egl_solutionid = :solutionid
            LEFT JOIN entity_rights_grp_mst eg
                ON eg.erm_entity_groupid = er.egl_entity_group_rightsid
            LEFT JOIN entity_mst e
                ON e.etm_entityid = eh.ehi_parent_entity_hierarchyid
            WHERE eh.ehi_parent_entity_hierarchyid = ANY(:branchid)
                        """, nativeQuery = true)
    List<Object[]> getEntityGrpRightsLinkData(
            @Param("solutionid") Long solutionid,
            @Param("branchid") Long[] branchid);

    // Fetch all mappings for a specific location + solution
    List<EntityGrpRightsLink> findByEntityMst_EtmEntityIdAndSolutionMst_SomSolutionID(
            Long entityId,
            Long solutionId);

    void deleteByEntityMst_EtmEntityIdAndSolutionMst_SomSolutionID(
            Long entityId,
            Long solutionId);
}
