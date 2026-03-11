package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MuzPayroll.entity.UserAndUserGroupLink;

public interface UserAndUserGroupLinkRepositoty extends JpaRepository<UserAndUserGroupLink, Long>{
    
}
