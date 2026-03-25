package com.example.MuzPayroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.UserDropDownRestPasswordDTO;

@Repository
public interface UserRepository extends JpaRepository<UserMst, Long> {

        UserMst findByUserCode(String userCode);

        @Query(value = """
                        SELECT *
                        FROM user_mst
                        WHERE user_mstid = :userCode
                        """, nativeQuery = true)
        UserMst findByUserMstId(Long userCode);

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

        Optional<UserMst> findByUserMstID(Long userMstID);

        @Query(value = "SELECT * FROM user_mst", nativeQuery = true)
        List<UserMst> findAllUsers();

        @Query(value = """
                        SELECT * FROM user_mst
                        WHERE LOWER(user_name) LIKE LOWER(CONCAT('%', :search, '%'))
                           OR LOWER(user_code) LIKE LOWER(CONCAT('%', :search, '%'))
                            """, nativeQuery = true)
        List<UserMst> searchUsers(@Param("search") String search);

        @Query("SELECT new com.example.MuzPayroll.entity.DTO.UserDropDownRestPasswordDTO(u.userCode, u.userName) FROM UserMst u WHERE u.UsmActiveYN = true")
        List<UserDropDownRestPasswordDTO> getUserDropdown();

        @Query(value = "SELECT MAX(user_mstid) FROM user_mst WHERE user_mstid BETWEEN 1000 AND 9999", nativeQuery = true)
        Long findMaxFourDigitUserMstId();
}
