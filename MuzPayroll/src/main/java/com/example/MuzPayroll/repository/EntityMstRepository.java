package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.EntityMst;

@Repository
public interface EntityMstRepository extends JpaRepository<EntityMst, Long> {

}
