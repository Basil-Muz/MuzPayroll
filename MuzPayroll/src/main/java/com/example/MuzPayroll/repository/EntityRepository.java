package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
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

        @Query(value = """
                        SELECT *
                        FROM entity_mst c
                        WHERE c.etm_entity_type_mccid = 13
                        AND (:activeStatusYN IS NULL OR c.etm_activeyn = :activeStatusYN)
                        """, nativeQuery = true)
        List<EntityMst> findCompanyByStatus(
                        @Param("activeStatusYN") Boolean activeStatusYN);

        @Query(value = """
                        SELECT *
                        FROM entity_mst
                        JOIN entity_hierarchy_info
                        ON entity_hierarchy_info.ehi_entity_hierarchyid = entity_mst.etm_entityid
                        WHERE etm_entity_type_mccid = 14
                        AND entity_hierarchy_info.ehi_companyid = :companyId
                        AND (:activeStatusYN IS NULL OR entity_mst.etm_activeyn = :activeStatusYN)
                        """, nativeQuery = true)
        List<EntityMst> findBranchByStatus(
                        @Param("activeStatusYN") Boolean activeStatusYN,
                        @Param("companyId") Long companyId);

        @Query(value = """
                        SELECT *
                        FROM entity_mst
                        JOIN entity_hierarchy_info
                        ON entity_hierarchy_info.ehi_entity_hierarchyid = entity_mst.etm_entityid
                        WHERE etm_entity_type_mccid = 15
                        AND (:activeStatusYN IS NULL OR entity_mst.etm_activeyn = :activeStatusYN)
                        AND entity_hierarchy_info.ehi_companyid = :companyId
                        AND (:branchId IS NULL OR entity_hierarchy_info.ehi_branchid = :branchId)
                        """, nativeQuery = true)
        List<EntityMst> findLocationByStatus(
                        @Param("activeStatusYN") Boolean activeStatusYN,
                        @Param("companyId") Long companyId,
                        @Param("branchId") Long branchId);

        boolean existsByEtmEntityId(Long etmEntityId);

        Optional<EntityMst> findByEtmCode(String etmCode);

        @Query("""
                        SELECT c
                        FROM EntityMst c
                        WHERE c.etmCode LIKE 'EM%'
                        ORDER BY c.etmEntityId DESC
                        """)
        List<EntityMst> findLatestEntityWithEMPrefix(Pageable pageable);

        @Query("""
                        SELECT c
                        FROM EntityMst c
                        WHERE c.etmEntityId = :etmEntityId
                        ORDER BY c.etmEntityId DESC
                        """)
        List<EntityMst> findLatestByEtmEntityID(
                        @Param("etmEntityId") Long etmEntityId,
                        Pageable pageable);

        @Query("""
                        SELECT MAX(c.etmEntityId)
                        FROM EntityMst c
                        WHERE c.etmEntityId >= 100000
                        """)
        Long findMaxEtmEntityID();

        @Query("""
                        SELECT a.etmCode
                        FROM EntityMst a
                        WHERE a.etmEntityId = :etmEntityId
                        """)
        Optional<String> findCodeByEtmEntityID(
                        @Param("etmEntityId") Long etmEntityId);

        @Query("SELECT c FROM EntityMst c")
        List<EntityMst> findAllEntityMsts();

}
