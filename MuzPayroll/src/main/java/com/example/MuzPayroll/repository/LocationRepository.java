package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.LocationMst;

@Repository
public interface LocationRepository extends JpaRepository<LocationMst, Long> {

    Optional<LocationMst> findByCode(String code);

    /**
     * Get the LATEST Location with LO prefix using Pageable
     * Pageable allows us to get only ONE record (LIMIT 1 equivalent)
     */
    @Query("SELECT c FROM LocationMst c WHERE c.code LIKE 'LO%' ORDER BY c.id DESC")
    List<LocationMst> findLatestLocationWithLOPrefix(Pageable pageable);

    @Query("SELECT COUNT(c) > 0 FROM LocationMst c WHERE c.locationMstID = :locationMstID")
    boolean existsByLocationMstID(@Param("locationMstID") Long locationMstID);

    // Using auto-increment ID (assumes latest has highest ID)
    @Query("SELECT c FROM LocationMst c WHERE c.locationMstID = :locationMstID " +
            "ORDER BY c.id DESC LIMIT 1")
    Optional<LocationMst> findLatestById(@Param("locationMstID") Long locationMstID);

    // Find maximum ID
    @Query("SELECT MAX(c.locationMstID) FROM LocationMst c WHERE c.locationMstID >= 300000")
    Long findMaxLocationMstID();

    @Query("SELECT a.code FROM LocationMst a WHERE a.locationMstID = :locationMstID")
    Optional<String> findCodeByMstId(@Param("locationMstID") Long locationMstID);

    @Query("SELECT c FROM LocationMst c")
    List<LocationMst> findAllLocation();

    @Query("SELECT c FROM LocationMst c WHERE c.activeStatusYN = true")
    List<LocationMst> findAllActiveLocation();

    @Query("SELECT c FROM LocationMst c WHERE c.activeStatusYN = false")
    List<LocationMst> findAllInActiveLocation();
}
