package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;
import com.example.MuzPayroll.entity.DTO.FormListDTO;

@RestController
@RequestMapping("EntityGrpRights")
public class EntityGrpRightsController {
    @GetMapping("/getGrpList")
     public ResponseEntity<List<EntityGrpRightsDTO>> getLocationGrpRightsList(
            @RequestParam Long solutionId,
            @RequestParam Long entitGroupId) {
                return null;

            }

}
