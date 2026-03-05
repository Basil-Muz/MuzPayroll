package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;
import com.example.MuzPayroll.entity.DTO.FormListDTO;
import com.example.MuzPayroll.repository.EntityGrpRightsRepository;
import com.example.MuzPayroll.service.EntityGrpRightsService;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/entityGrpRights")
public class EntityGrpRightsController {

    @Autowired
    EntityGrpRightsService locatioEntityGrpRightsService;

    @Autowired
    EntityGrpRightsRepository locationEntityGrpRightsRepository;

    @GetMapping("/getGrpList")
     public ResponseEntity<List<EntityGrpRightsDTO>> getLocationGrpRightsList(
            @RequestParam Long solutionId,
            @RequestParam Long entityGroupId) {
                 return ResponseEntity.ok(
            locatioEntityGrpRightsService.getRights(entityGroupId, solutionId)
    );

            }

}
