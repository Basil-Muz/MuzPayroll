package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.MuzPayroll.entity.UserMst;

public interface UserRepository extends JpaRepository<UserMst, Long> {
    UserMst findByUserCode(Long userCode);
}
