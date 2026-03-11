package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityLog;
import com.example.MuzPayroll.entity.EntityLogPK;
import com.example.MuzPayroll.entity.DTO.EntityDataDTO;

@Repository
public interface EntityLogRepository extends JpaRepository<EntityLog, EntityLogPK> {

        @Override
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

        @Query(value = """
                        SELECT DISTINCT
                        el.etm_entityid,
                        el.row_no ,
                        el.etm_code,
                        el.etm_name ,
                        el.etm_short_name ,
                        el.active_date ,
                        el.etm_activeyn ,
                        el.amend_no ,
                        el.address_infoid ,
                        el.add_row_no ,
                        el.etm_doc_infoid ,
                        el.etm_image ,
                        el.etm_int_prefix ,
                        el.etm_prefix ,
                        el.in_active_date ,
                        el.etm_entity_type_mccid ,
                        el.etm_auth_infoid ,

                        ail.address_infoid as ail_address_infoid,
                        ail.address ,
                        ail.address1 ,
                        ail.address2 ,
                        ail.country,
                        ail.state ,
                        ail.district ,
                        ail.place ,
                        ail.pincode ,
                        ail.landline_number ,
                        ail.mobile_number ,
                        ail.email ,
                        ail.employer_name ,
                        ail.designation ,
                        ail.employer_number ,
                        ail.employer_email ,
                        ail.withaffectdate ,

                        atbl.auth_id ,
                        atbl.authorization_status ,
                        atbl.authorization_date ,
                        atbl.user_code
                                        FROM entity_log el
                                        JOIN address_info_log ail
                                            ON el.address_infoid = ail.address_infoid
                                            AND el.add_row_no = ail.add_row_no
                                        JOIN authorization_tbl atbl
                                            ON atbl.auth_id = el.etm_auth_infoid
                                        WHERE el.etm_entityid = :etmEntityID
                                        ORDER BY el.row_no DESC
                                        """, nativeQuery = true)
        List<EntityLog> findAllEntityLogs(@Param("etmEntityID") Long etmEntityID);

        @Query(value = """
                        SELECT *
                        FROM entity_hierarchy_info eh
                        JOIN entity_log el
                        ON eh.ehi_entity_hierarchyid = el.etm_entityid
                        JOIN authorization_tbl a
                        ON el.etm_auth_infoid = a.auth_id
                        WHERE eh.ehi_leaf_entity_type_mccid = 13
                        AND eh.ehi_entity_hierarchyid = :etmEntityID
                        """, nativeQuery = true)
        List<EntityLog> findAllAmendList(@Param("etmEntityID") Long etmEntityID);

        @Query(value = """
                                 SELECT
                                 em.etm_entityid AS etmEntityId,
                                 em.etm_prefix AS etmPrefix,
                                 em.etm_code AS etmCode,
                                 em.etm_name AS etmName,
                                 em.etm_short_name AS etmShortName,
                                 em.etm_activeyn AS etmActiveYN,
                                 em.etm_image AS imagePath,
                                 em.etm_int_prefix AS etmIntPrefix,
                                 em.active_date AS activeDate,
                                 em.in_active_date AS inactiveDate,
                                 em.etm_entity_type_mccid AS etmEntityTypeMccID,
                                 em.etm_doc_infoid AS etmDocInfoID,
                                 em.address_infoid AS AddressInfoID,
                                  em.amend_no AS AmendNo,
                        ad.address AS Address,
                        ad.address1 AS Address1,
                        ad.address2 AS Address2,
                        ad.country AS Country,
                        ad.designation AS Designation,
                           ad.district AS District,
                        ad.email AS Email,
                        ad.employer_email AS EmployerEmail,
                        ad.employer_name AS EmployerName,
                        ad.employer_number AS EmployerNumber,
                        ad.landline_number AS LandlineNumber,
                        ad.mobile_number AS MobileNumber,
                        ad.pincode AS Pincode,
                        ad.place AS Place,
                        ad.state AS State,
                        ad.withaffectdate AS Withaffectdate,
                                a.auth_id AS AuthId,
                                a.authorization_date  AS AuthorizationDate,
                                a.authorization_status AS AuthorizationStatus,
                                a.user_code  AS UserCode
                                 FROM entity_log em
                                 JOIN entity_hierarchy_info eh
                                 ON em.etm_entityid = eh.ehi_entity_hierarchyid
                                 JOIN address_info_log ad
                                 ON em.address_infoid = ad.address_infoid
                                 AND em.row_no = ad.add_row_no
                                 JOIN authorization_tbl a
                                 ON em.etm_auth_infoid =  a.auth_id
                                 WHERE em.amend_no = :amendNo
                                 AND eh.ehi_leaf_entity_type_mccid = :mccId
                                 AND eh.ehi_entity_hierarchyid = :etmEntityID
                                 """, nativeQuery = true)
        List<EntityDataDTO> getEntityLogs(
                        @Param("etmEntityID") Long etmEntityID,
                        @Param("mccId") Long mccId,
                        @Param("amendNo") String amendNo);

}