package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MuzPayroll.entity.TempUserPermission;

public interface TempUserPermissionRepository extends JpaRepository<TempUserPermission, Long> {
    
}
