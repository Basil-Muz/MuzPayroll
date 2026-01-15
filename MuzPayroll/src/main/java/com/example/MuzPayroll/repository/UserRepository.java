package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.UserMst;

@Repository
public interface UserRepository extends JpaRepository<UserMst, Long> {
    UserMst findByUserCode(String userCode);
}
