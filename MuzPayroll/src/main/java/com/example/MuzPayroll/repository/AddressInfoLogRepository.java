package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.AddressInfoLog;

@Repository
public interface AddressInfoLogRepository extends JpaRepository<AddressInfoLog, Long> {

}
