package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MuzPayroll.entity.Authorization;

public interface AuthorizationRepository extends JpaRepository<Authorization, Long> {
    
}
