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
            @RequestParam Long userId,
            @RequestParam Long solutionId,
            @RequestParam Long entityHierarchyId,
            @RequestParam Long productid,
            @RequestParam(required = false) Long menu_row_no) {

        return menuService.getMenu(transtype, transsubtype, userId, solutionId, entityHierarchyId, productid,
                menu_row_no);
    }

    @GetMapping("/sidebar")
    public List<MenuDTO> getSideBar(
            @RequestParam String transtype,
            @RequestParam String transsubtype,
            @RequestParam Integer userId,
            @RequestParam Integer solutionId,
            @RequestParam Integer optionid,
            @RequestParam Integer entity_hierarchy_id) {

        return menuService.getSideBar(transtype, transsubtype, userId, solutionId, optionid, entity_hierarchy_id);
    }
}
