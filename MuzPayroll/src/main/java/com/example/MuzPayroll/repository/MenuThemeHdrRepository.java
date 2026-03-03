package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.MenuThemeHdr;

@Repository
public interface MenuThemeHdrRepository extends JpaRepository<MenuThemeHdr, Long> {

}
