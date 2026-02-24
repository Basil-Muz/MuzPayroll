package com.example.MuzPayroll.service;

import java.util.List;

import com.example.MuzPayroll.entity.DTO.MenuDTO;

public interface MenuService {

    List<MenuDTO> getMenu(
            String transtype,
            String transsubtype,
            Integer userId,
            Integer solutionId,
            Integer entityHierarchyId,
            Integer menu_row_no,
            Integer productid);
}
