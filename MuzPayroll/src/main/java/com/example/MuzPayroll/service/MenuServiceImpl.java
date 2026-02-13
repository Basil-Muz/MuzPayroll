package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.DTO.MenuDTO;
import com.example.MuzPayroll.repository.MenuRepository;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;

    public MenuServiceImpl(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @Override
    public List<MenuDTO> getMenu(String transtype, String transsubtype, Integer userId, Integer solutionId,
            Integer entityHierarchyId) {
        return menuRepository.getMenu(transtype, transsubtype, userId, solutionId,
                entityHierarchyId);
    }
}
