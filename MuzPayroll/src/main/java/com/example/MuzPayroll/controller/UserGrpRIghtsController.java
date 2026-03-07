package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpRightsDTO;
import com.example.MuzPayroll.service.UserGrpRightsService;

@RestController
@RequestMapping("/userGrpRights")
@CrossOrigin(origins = "*")
public class UserGrpRIghtsController {
    @Autowired
    private UserGrpRightsService userGrpRightsService;

    @GetMapping("/getGrpList")
     public ResponseEntity<List<UserGrpRightsDTO>> getLocationGrpRightsList(
            @RequestParam Long solutionId,
            @RequestParam Long userGroupId) {
                 return ResponseEntity.ok(
            userGrpRightsService.getRights(userGroupId, solutionId)
    );
    }
    @PostMapping("/save")
    public Response<UserGrpRightsDTO> saveEntityRightsGrp(@RequestBody List<UserGrpRightsDTO> dto) {
        return userGrpRightsService.saveWrapper(dto,"INSERT");
    }
}
