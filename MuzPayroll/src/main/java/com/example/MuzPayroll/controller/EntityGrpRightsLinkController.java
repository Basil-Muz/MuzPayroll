package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.EntityGrpRightsLinkDTO;
import com.example.MuzPayroll.service.EntityGrpRightsLinkService;

@RestController
@RequestMapping("/entity-rights")
public class EntityGrpRightsLinkController {
    @Autowired
    EntityGrpRightsLinkService entityGrpRightsLinkService;

    @GetMapping("/linkData")
    public ResponseEntity<List<EntityGrpRightsLinkDTO>> getEntityRights(
            @RequestParam Long solutionId,
            @RequestParam List<Long> branchIds) {

        List<EntityGrpRightsLinkDTO> result = entityGrpRightsLinkService.getData(solutionId, branchIds);

        return ResponseEntity.ok(result);
    }

}
