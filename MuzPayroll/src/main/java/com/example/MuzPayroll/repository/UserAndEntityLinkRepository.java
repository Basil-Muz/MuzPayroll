package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MuzPayroll.entity.UserAndEntityLink;

public interface UserAndEntityLinkRepository extends JpaRepository<UserAndEntityLink, Long> {
    
}
