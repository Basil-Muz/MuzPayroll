package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.AddressInfoMst;

@Repository
public interface AddressInfoMstRepository extends JpaRepository<AddressInfoMst, Long> {

}
