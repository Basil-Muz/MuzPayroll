package com.example.MuzPayroll.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.Authorization;

@Repository
public interface AuthorizationRepository extends JpaRepository<Authorization, Long> {

    @Query("SELECT a.authorizationStatus FROM Authorization a WHERE a.authId = :authId ")
    Optional<Boolean> findStatusByAuthId(@Param("authId") Long authId);

    @Query("SELECT MAX(a.authId) FROM Authorization a WHERE a.mstId = :mstId")
    Optional<Long> findLatestAuthIdByMstId(@Param("mstId") Long mstId);


}
