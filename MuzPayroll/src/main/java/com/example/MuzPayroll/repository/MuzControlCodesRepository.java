package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.MuzControlCodes;

@Repository
public interface MuzControlCodesRepository extends JpaRepository<MuzControlCodes, Long> {

}
