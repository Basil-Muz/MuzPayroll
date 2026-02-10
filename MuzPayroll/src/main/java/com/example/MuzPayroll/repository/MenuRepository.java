package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.DTO.MenuDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class MenuRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<MenuDTO> getMenu(
            // String transtype,
            // String subtype,
            Integer userid,
            Integer solutionid,
            Integer entityid) {

        Query query = entityManager.createNativeQuery(
                "SELECT * FROM menufunction(:userid,:solutionid,:entityid)");

        // query.setParameter("transtype", transtype);
        // query.setParameter("subtype", subtype);
        query.setParameter("userid", userid);
        query.setParameter("solutionid", solutionid);
        query.setParameter("entityid", entityid);

        List<Object[]> rows = query.getResultList();

        return rows.stream().map(row -> {

            MenuDTO dto = new MenuDTO();

            dto.setProductId((Integer) row[0]);
            dto.setMenuRowNo((Integer) row[1]);
            dto.setOptionYn((Boolean) row[2]);
            dto.setOptionId((Integer) row[3]);
            dto.setUrl((String) row[4]);
            dto.setDisplayName((String) row[5]);
            dto.setDescription((String) row[6]);
            dto.setOptionType((String) row[7]);
            dto.setParentMenuRowNo((Integer) row[8]);
            dto.setLevelNo((Integer) row[9]);

            return dto;

        }).toList();
    }

}
