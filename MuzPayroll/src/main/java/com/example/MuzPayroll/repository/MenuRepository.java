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
            String transtype,
            String transsubtype,
            Integer userid,
            Integer solutionid,
            Integer entityid,
            Integer productid,
            Integer menu_row_no) {

        Query query = entityManager.createNativeQuery(
                "SELECT * FROM menufunction(:transtype,:transsubtype,:userid,:solutionid,:entityid,:productid,:menu_row_no)");

        query.setParameter("transtype", transtype);
        query.setParameter("transsubtype", transsubtype);
        query.setParameter("userid", userid);
        query.setParameter("solutionid", solutionid);
        query.setParameter("entityid", entityid);
        query.setParameter("productid", productid);
        query.setParameter("menu_row_no", menu_row_no);

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

    public List<MenuDTO> getSideBar(
            String transtype,
            String transsubtype,
            Integer userid,
            Integer solutionid,
            Integer optionid,
            Integer entity_hierarchy_id) {

        Query query = entityManager.createNativeQuery(
                "SELECT * FROM OptionRightsProc(:transtype,:transsubtype,:userid,:solutionid,:optionid,:entity_hierarchy_id)");

        query.setParameter("transtype", transtype);
        query.setParameter("transsubtype", transsubtype);
        query.setParameter("userid", userid);
        query.setParameter("solutionid", solutionid);
        query.setParameter("optionid", optionid);
        query.setParameter("entity_hierarchy_id", entity_hierarchy_id);

        List<Object[]> rows = query.getResultList();

        return rows.stream().map(row -> {

            MenuDTO dto = new MenuDTO();

            dto.setSolutionId((Integer) row[0]);
            dto.setOptionId((Integer) row[1]);
            dto.setAdd((Boolean) row[2]);
            dto.setEdit((Boolean) row[3]);
            dto.setView((Boolean) row[4]);
            dto.setDelete((Boolean) row[5]);
            dto.setPrint((Boolean) row[6]);
            dto.setDeny((Boolean) row[7]);

            return dto;

        }).toList();
    }

}

// SELECT * FROM OptionRightsProc ('OPTION_RIGHTS','',1001,1,122,100064)
