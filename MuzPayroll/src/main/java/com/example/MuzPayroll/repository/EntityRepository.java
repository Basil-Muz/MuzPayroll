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
    List<Object[]> getUserEntities(
            @Param("userId") Integer userId,
            @Param("mccId") Integer mccId);
}
