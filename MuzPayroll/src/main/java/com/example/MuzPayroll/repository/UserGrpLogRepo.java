package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.UserGrpLog;
import com.example.MuzPayroll.entity.UserGrpLogPK;

@Repository
public interface UserGrpLogRepo extends JpaRepository<UserGrpLog, UserGrpLogPK> {

        @Query("""
                            SELECT MAX(c.userGrpLogPK.rowNo)
                            FROM UserGrpLog c
                            WHERE c.userGrpLogPK.ugmUserGroupID = :ugmUserGroupID
                        """)
        Long findMaxRowNo(@Param("ugmUserGroupID") Long ugmUserGroupID);

        @Query(value = """
                        SELECT MAX(CAST(amend_no AS INTEGER))
                        FROM user_grp_log
                        WHERE ugm_user_groupid = :ugm_user_groupid
                        AND amend_no ~ '^[0-9]+$'
                        """, nativeQuery = true)
        Optional<Long> findLatestAmendNoByMstId(@Param("ugm_user_groupid") Long ugm_user_groupid);

        @Query(value = """
                        SELECT *
                        FROM user_grp_log
                        WHERE ugm_user_groupid = :ugm_user_groupid
                        AND amend_no ~ '^[0-9]+$'
                        ORDER BY CAST(amend_no AS INTEGER) DESC
                        """, nativeQuery = true)
        List<UserGrpLog> findAllLogsByUserGroupID(@Param("ugm_user_groupid") Long ugm_user_groupid);

        List<UserGrpLog> findByUserGrpLogPK_UgmUserGroupIDOrderByUserGrpLogPK_RowNoDesc(Long ugmUserGroupID);

}
