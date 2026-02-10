package com.example.MuzPayroll.service;

import java.util.List;

import com.example.MuzPayroll.entity.DTO.MenuDTO;

public interface MenuService {

    List<MenuDTO> getMenu(
            Integer userId,
            Integer solutionId,
            Integer entityHierarchyId);

}
