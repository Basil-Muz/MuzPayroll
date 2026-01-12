package com.example.MuzPayroll.repository;

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
}
