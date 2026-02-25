package com.example.MuzPayroll.repository;

import org.springframework.stereotype.Repository;
import com.example.MuzPayroll.entity.EntityRightsGrpLog;
import com.example.MuzPayroll.entity.EntityRightsGrpLogPK;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EntityRightsGrpLogRepo extends JpaRepository<EntityRightsGrpLog, EntityRightsGrpLogPK>{

    // Optional<Long> findLatestAmendNoByMstId(Long mstID);

@Query("""
    SELECT COALESCE(MAX(l.entityRightsGrpLogPK.rowNo), 0)
    FROM EntityRightsGrpLog l
    WHERE l.entityRightsGrpLogPK.ermEntityRightsGroupID = :grpId
""")
Long findMaxRowNo(@Param("grpId") Long grpId);

@Query("""
    SELECT l.entityRightsGrpLogPK.rowNo
    FROM EntityRightsGrpLog l
    WHERE l.entityRightsGrpLogPK.ermEntityRightsGroupID = :grpId
    ORDER BY l.entityRightsGrpLogPK.rowNo DESC
""")
Optional<Long> findLatestAmendNoByEntityRightsGroupID(
        @Param("grpId") Long grpId
);

List<EntityRightsGrpLog> findByEntityRightsGrpLogPK_ErmEntityRightsGroupIDOrderByEntityRightsGrpLogPK_RowNoDesc(
        Long mstID);
    
}
