package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.UserGrpMst;

@Repository
public interface UserGrpMstRepo extends JpaRepository<UserGrpMst, Long> {

    // Find maximum ID
    @Query("SELECT MAX(c.UgmUserGroupID) FROM UserGrpMst c WHERE c.UgmUserGroupID >= 100011")
    Long findMaxUgmUserGroupID();

    // Optional<UserGrpMst> findByCode(String code);

    // List<UserGrpMst> findByEntityMst_UgmEntityHierarchyID(Long
    // ugmEntityHierarchyID);

    @Query("SELECT u FROM UserGrpMst u WHERE u.entityMst.EtmEntityID = :id")
    List<UserGrpMst> findByEntityHierarchyID(@Param("id") Long id);

    @Query("""
            SELECT b FROM UserGrpMst b
            WHERE b.entityMst.EtmEntityID = :id
            AND b.UgmActiveYN = true
            """)
    List<UserGrpMst> findActiveUserGrpsByEntityHierarchyID(@Param("id") Long id);

    @Query("""
            SELECT b FROM UserGrpMst b
            WHERE b.entityMst.EtmEntityID = :id
            AND b.UgmActiveYN = false
            """)
    List<UserGrpMst> findInactiveUserGrpsByEntityHierarchyID(@Param("id") Long id);

    /**
     * Get the LATEST Location with LO prefix using Pageable
     * Pageable allows us to get only ONE record (LIMIT 1 equivalent)
     */
    // @Query("SELECT c FROM LocationMst c WHERE c.code LIKE 'LO%' ORDER BY c.id
    // DESC")
    // List<LocationMst> findLatestLocationWithLOPrefix(Pageable pageable);

    // @Query("SELECT COUNT(c) > 0 FROM LocationMst c WHERE c.locationMstID =
    // :locationMstID")
    // boolean existsByLocationMstID(@Param("locationMstID") Long locationMstID);

    // // Using auto-increment ID (assumes latest has highest ID)
    // @Query("SELECT c FROM LocationMst c WHERE c.locationMstID = :locationMstID "
    // +
    // "ORDER BY c.id DESC LIMIT 1")
    // Optional<LocationMst> findLatestById(@Param("locationMstID") Long
    // locationMstID);

    // @Query("SELECT a.code FROM LocationMst a WHERE a.locationMstID =
    // :locationMstID")
    // Optional<String> findCodeByMstId(@Param("locationMstID") Long locationMstID);

    // @Query("SELECT c FROM LocationMst c")
    // List<LocationMst> findAllLocation();

}
