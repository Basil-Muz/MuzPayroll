package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.UserGrpRights;

@Repository
public interface UserGrpRightsRepository extends JpaRepository<UserGrpRights, Long> {
    @Modifying(clearAutomatically = true)
@Query(value = """
    INSERT INTO user_grp_rights
    (ugr_user_groupid,
     ugr_optionid,
     ugr_solutionid,
     ugr_add,
     ugr_edit,
     ugr_view,
     ugr_delete,
     ugr_print,
     ugr_last_mod_userid,
     ugr_last_mod_date)
    SELECT
        :grpId,
        t.option_id,
        t.solution_id,
        false,
        false,
        false,
        false,
        false,
        :userId,
        CURRENT_DATE
    FROM tem_user_permission_table t
""", nativeQuery = true)
void insertDefaultPermissions(Long grpId, Long userId);

    @Query(value = """
        SELECT e.*
        FROM user_grp_rights e
        JOIN option_mst o ON e.ugr_optionid = o.opm_optionid
        JOIN module_mst m ON o.opm_moduleid = m.mom_moduleid
        WHERE e.ugr_user_groupid = :userGroupId
        AND e.ugr_solutionid = :solutionId
    """, nativeQuery = true)
    List<UserGrpRights> findRights(
            @Param("userGroupId") Long userGroupId,
            @Param("solutionId") Long solutionId
    );

}
