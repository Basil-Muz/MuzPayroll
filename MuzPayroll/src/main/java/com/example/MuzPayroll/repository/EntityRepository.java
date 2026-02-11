package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityMst;

@Repository
public interface EntityRepository extends JpaRepository<EntityMst, Long> {

    @Query(value = """
            SELECT
                uel.ehi_entity_hierarchyid,
                em.etm_name,
                mcc.mcc_name
            FROM entity_mst em
            JOIN entity_hierarchy_info uel
                ON em.etm_entityid =uel.ehi_entity_hierarchyid
            JOIN muz_control_codes mcc
                ON mcc.mccid = em.etm_entity_type_mccid
            WHERE mcc.mccid = :mccId
            """, nativeQuery = true)
    List<Object[]> getAdminCompany(
            @Param("mccId") Long mccId);

    @Query(value = """
            SELECT
                uel.uel_entity_hierarchyid,
                em.etm_name,
                mcc.mcc_name
            FROM user_and_entity_link uel
            JOIN entity_mst em
                ON uel.uel_entity_hierarchyid = em.etm_entityid
            JOIN muz_control_codes mcc
                ON mcc.mccid = em.etm_entity_type_mccid
            WHERE mcc.mccid = :mccId
            AND uel.uel_userid = :userId
            """, nativeQuery = true)
    List<Object[]> getUserCompany(
            @Param("userId") Long userId,
            @Param("mccId") Long mccId);

    @Query(value = """
             SELECT
                uel.uel_entity_hierarchyid,
                em.etm_name,
                mcc.mcc_name
            FROM user_and_entity_link uel
            JOIN entity_mst em
                ON uel.uel_entity_hierarchyid = em.etm_entityid
            JOIN muz_control_codes mcc
                ON mcc.mccid = em.etm_entity_type_mccid
            JOIN entity_hierarchy_info
                ON entity_hierarchy_info.ehi_entity_hierarchyid = em.etm_entityid
            WHERE mcc.mccid = :mccId
            AND uel.uel_userid = :userId
            AND entity_hierarchy_info.ehi_companyid = :companyId
            """, nativeQuery = true)
    List<Object[]> getUserBranch(
            @Param("userId") Long userId,
            @Param("companyId") Long companyId,
            @Param("mccId") Long mccId);

    @Query(value = """
              SELECT
                 uel.ehi_entity_hierarchyid,
                 em.etm_name,
                 mcc.mcc_name
             FROM entity_mst em
             JOIN entity_hierarchy_info uel
                 ON em.etm_entityid =uel.ehi_entity_hierarchyid
             JOIN muz_control_codes mcc
                 ON mcc.mccid = em.etm_entity_type_mccid
             WHERE mcc.mccid = :mccId
            AND uel.ehi_companyid = :companyId
             """, nativeQuery = true)
    List<Object[]> getAdminBranch(
            @Param("companyId") Long companyId,
            @Param("mccId") Long mccId);

    @Query(value = """
            SELECT
                uel.uel_entity_hierarchyid,
                em.etm_name,
                mcc.mcc_name
            FROM user_and_entity_link uel
            JOIN entity_mst em
                ON uel.uel_entity_hierarchyid = em.etm_entityid
            JOIN muz_control_codes mcc
                ON mcc.mccid = em.etm_entity_type_mccid
            JOIN entity_hierarchy_info
                ON entity_hierarchy_info.ehi_entity_hierarchyid = em.etm_entityid
            WHERE mcc.mccid = :mccId
            AND uel.uel_userid = :userId
            AND entity_hierarchy_info.ehi_branchid =:branchId
            """, nativeQuery = true)
    List<Object[]> getUserLocation(
            @Param("userId") Long userId,
            @Param("branchId") Long branchId,
            @Param("mccId") Long mccId);

    @Query(value = """
            SELECT
                uel.ehi_entity_hierarchyid,
                em.etm_name,
                mcc.mcc_name
            FROM entity_mst em
            JOIN entity_hierarchy_info uel
                ON em.etm_entityid =uel.ehi_entity_hierarchyid
            JOIN muz_control_codes mcc
                ON mcc.mccid = em.etm_entity_type_mccid
            WHERE mcc.mccid =:mccId
            AND uel.ehi_companyid = :companyId
            AND uel.ehi_branchid =:branchId
            """, nativeQuery = true)
    List<Object[]> getAdminLocation(
            @Param("companyId") Long companyId,
            @Param("branchId") Long branchId,
            @Param("mccId") Long mccId);
}
