package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.UserMst;

@Repository
public interface UserRepository extends JpaRepository<UserMst, Long> {
   
    UserMst findByUserCode(String userCode);

        @Query(value = """
            SELECT usm_entity_hierarchyid
            FROM user_mst
            WHERE user_code = :userCode 
            """, nativeQuery = true)
    Long findBranchIdByUserCode(@Param("userCode") String userCode);

            @Query(value = """
            SELECT usm_default_entity_hierarchyid
            FROM user_mst
            WHERE user_code = :userCode 
            """, nativeQuery = true)
    Long findLocationIdByUserCode(@Param("userCode") String userCode);
}
