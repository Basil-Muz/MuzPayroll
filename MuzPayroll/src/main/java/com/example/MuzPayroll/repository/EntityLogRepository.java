package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityLog;
import com.example.MuzPayroll.entity.EntityLogPK;

@Repository
public interface EntityLogRepository extends JpaRepository<EntityLog, EntityLogPK> {

    long count();

    @Query("""
                SELECT MAX(c.entityLogPK.rowNo)
                FROM EntityLog c
                WHERE c.entityLogPK.etmEntityID = :etmEntityID
            """)
    Long findMaxRowNo(@Param("etmEntityID") Long etmEntityID);

    @Query(value = """
            SELECT MAX(CAST(amend_no AS INTEGER))
            FROM entity_log
            WHERE etm_entityid = :etmEntityID
            AND amend_no ~ '^[0-9]+$'
            """, nativeQuery = true)
    Optional<Long> findLatestAmendNoByMstId(@Param("etmEntityID") Long etmEntityID);

    @Query(value = """
            SELECT *
            FROM entity_log
            WHERE etm_entityid = :etmEntityID
            AND amend_no ~ '^[0-9]+$'
            ORDER BY CAST(amend_no AS INTEGER) DESC
            """, nativeQuery = true)
    List<EntityLog> findAllLogsByEtmEntityID(@Param("etmEntityID") Long etmEntityID);

    List<EntityLog> findByEntityLogPK_EtmEntityIDOrderByEntityLogPK_RowNoDesc(Long etmEntityID);

}
