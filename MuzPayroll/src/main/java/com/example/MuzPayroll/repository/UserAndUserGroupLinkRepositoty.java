package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.MuzPayroll.entity.UserAndUserGroupLink;

import jakarta.transaction.Transactional;

public interface UserAndUserGroupLinkRepositoty extends JpaRepository<UserAndUserGroupLink, Long> {

    @Modifying
    @Transactional
    @Query(value = """
            DELETE FROM user_and_user_group_link
            WHERE uug_userid = :userId
            """, nativeQuery = true)
    void deleteByUserMstId(@Param("userId") Long userId);

}
