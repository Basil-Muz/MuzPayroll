package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.MenuDTO;
import com.example.MuzPayroll.service.MenuService;

@RestController
@RequestMapping("/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/mainmenu")
    public List<MenuDTO> getMenu(
            @RequestParam String transtype,
            @RequestParam String transsubtype,
            @RequestParam Integer userId,
            @RequestParam Integer solutionId,
            @RequestParam Integer entityHierarchyId) {

         return menuService.getMenu(transtype, transsubtype, userId, solutionId, entityHierarchyId);
    }
}
