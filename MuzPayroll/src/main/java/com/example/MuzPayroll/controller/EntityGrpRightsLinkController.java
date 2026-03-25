package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.EntityGrpLinkDTO;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsLinkDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.service.EntityGrpRightsLinkService;

@RestController
@RequestMapping("/entity-rights")
@CrossOrigin(origins = "*")
public class EntityGrpRightsLinkController {
    @Autowired
    EntityGrpRightsLinkService entityGrpRightsLinkService;

    @PostMapping("/save")
    public Response<EntityGrpRightsLinkDTO> save(@ModelAttribute EntityGrpRightsLinkDTO dto) {
        return entityGrpRightsLinkService.saveWrapper(dto, "INSERT");
    }

    @GetMapping("/linkData")
    public ResponseEntity<List<EntityGrpLinkDTO>> getEntityRights(
            @RequestParam Long solutionId,
            @RequestParam List<Long> branchIds) {

        List<EntityGrpLinkDTO> result = entityGrpRightsLinkService.getData(solutionId, branchIds);

        return ResponseEntity.ok(result);
    }

}
