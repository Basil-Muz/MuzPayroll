package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.LocationLog;

@Repository
public interface LocationLogRepository extends JpaRepository<LocationLog, Long> {

}
