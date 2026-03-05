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
                        el.address_infoid ,  -- Aliased to avoid conflict
                        el.add_row_no ,
                        el.etm_doc_infoid ,
                        el.etm_image ,
                        el.etm_int_prefix ,
                        el.etm_prefix ,
                        el.in_active_date ,
                        el.etm_entity_type_mccid ,
                        el.etm_auth_infoid ,

                        ail.address_infoid as ail_address_infoid,  -- Aliased to avoid conflict
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

}
