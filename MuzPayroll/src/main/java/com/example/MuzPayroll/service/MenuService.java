package com.example.MuzPayroll.service;

import java.util.List;

import com.example.MuzPayroll.entity.DTO.MenuDTO;

public interface MenuService {

    List<MenuDTO> getMenu(
            String transtype,
            String transsubtype,
            Long userId,
            Long solutionId,
            Long entityHierarchyId,
            Long menu_row_no,
            Long productid);

    List<MenuDTO> getSideBar(
            String transtype,
            String transsubtype,
            Long userId,
            Long solutionId,
            Long optionid,
            Long entity_hierarchy_id);
}
