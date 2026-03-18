package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.MuzPayroll.entity.UserTypeMst;

public interface UserTypeMstRepository extends JpaRepository<UserTypeMst, Long> {

    @Query(value = """
            SELECT *
            FROM user_type_mst
            WHERE utm_user_typeid <> 100011
            """, nativeQuery = true)
    List<UserTypeMst> findByUtmUserTypeIDNot();

    @Query(value = """
            SELECT
                u.user_mstid,
                u.user_name,
                u.user_code,

                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'id', ugm.ugm_user_groupid,
                            'name', ugm.ugm_name
                        )
                    ) FILTER (WHERE ugm.ugm_user_groupid IS NOT NULL),
                    '[]'
                ) AS user_groups,

                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'id', em.etm_entityid,
                            'name', em.etm_name
                        )
                    ) FILTER (WHERE em.etm_entityid IS NOT NULL),
                    '[]'
                ) AS entities

            FROM user_mst u

            LEFT JOIN user_and_user_group_link ug
                ON ug.uug_userid = u.user_mstid

            LEFT JOIN user_and_entity_link l
                ON l.uel_userid = u.user_mstid

            LEFT JOIN user_grp_mst ugm
                ON ugm.ugm_user_groupid = ug.uug_user_groupid

            LEFT JOIN entity_mst em
                ON em.etm_entityid = l.uel_entity_hierarchyid

            WHERE
                u.usm_entity_hierarchyid = 100064
            AND u.usm_user_typeid IN (100012,100013)

            GROUP BY
                u.user_mstid,
                u.user_name,
                u.user_code;
            """, nativeQuery = true)
    List<Object[]> findList(
            @Param("companyId") Long companyId,
            @Param("userCode") String userCode,
            @Param("userTypeIds") List<Long> userTypeIds,
            @Param("userGrpIds") List<Long> userGrpIds,
            @Param("locationIds") List<Long> locationIds);

}
