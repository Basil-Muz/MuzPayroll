package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.MuzPayroll.entity.OptionMst;

public interface OptionMstRepository extends JpaRepository<OptionMst, Long>{
         @Query(value = """
            SELECT *
            FROM option_mst
            WHERE opm_optionid = :optionMstId 
            """, nativeQuery = true)
    OptionMst findByOptionMstId(Long optionMstId);
    
}
