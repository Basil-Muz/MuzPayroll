package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.MuzPayroll.entity.UserAndEntityLink;

import jakarta.transaction.Transactional;

public interface UserAndEntityLinkRepository extends JpaRepository<UserAndEntityLink, Long> {
    @Modifying
    @Transactional
    @Query(value = """
            DELETE FROM user_and_entity_link where uel_userid = :userId
            """, nativeQuery = true)
    void deleteByUserMstId(@Param("userId") Long userId);

}
