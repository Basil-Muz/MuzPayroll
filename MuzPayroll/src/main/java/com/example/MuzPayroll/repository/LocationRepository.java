package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.LocationMst;

@Repository
public interface LocationRepository extends JpaRepository<LocationMst, Integer> {
}
