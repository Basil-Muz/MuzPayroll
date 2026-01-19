package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.LocationLog;
import com.example.MuzPayroll.entity.LocationLogPK;

@Repository
public interface LocationLogRepository extends JpaRepository<LocationLog, LocationLogPK> {

        @Query("""
                            SELECT MAX(c.locationLogPK.rowNo)
                            FROM LocationLog c
                            WHERE c.locationLogPK.locationMstID = :locationMstID
                        """)
        Long findMaxRowNo(@Param("locationMstID") Long locationMstID);

        @Query(value = """
                        SELECT MAX(CAST(amend_no AS INTEGER))
                        FROM location_log
                        WHERE location_mstid = :locationMstID
                        AND amend_no ~ '^[0-9]+$'
                        """, nativeQuery = true)
        Optional<Long> findLatestAmendNoByMstId(@Param("locationMstID") Long locationMstID);

        @Query(value = """
                        SELECT *
                        FROM location_log
                        WHERE location_mstid = :locationMstID
                        AND amend_no ~ '^[0-9]+$'
                        ORDER BY CAST(amend_no AS INTEGER) DESC
                        """, nativeQuery = true)
        List<LocationLog> findAllLogsByLocationMstID(@Param("locationMstID") Long locationMstID);

        List<LocationLog> findByLocationLogPK_LocationMstIDOrderByLocationLogPK_RowNoDesc(Long locationMstID);

}
