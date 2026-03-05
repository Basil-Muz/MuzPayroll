package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import com.example.MuzPayroll.entity.EntityGrpRights;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;

public interface EntityGrpRightsRepository extends JpaRepository<EntityGrpRights, Long> {

@Query("""
SELECT e 
FROM EntityGrpRights e
JOIN FETCH e.optionMst o
JOIN FETCH o.moduleEntity m
WHERE e.entityRightsGrpMst.ErmEntityGroupID = :entityGroupId
AND e.solutionMst.SomSolutionID = :solutionId
""")
List<EntityGrpRights> findRights(
        @Param("entityGroupId") Long entityGroupId,
        @Param("solutionId") Long solutionId
);


}
