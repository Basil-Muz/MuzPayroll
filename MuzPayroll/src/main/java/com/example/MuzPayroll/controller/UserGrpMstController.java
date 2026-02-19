package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.UserGrpMst;
import com.example.MuzPayroll.entity.DTO.FormListDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpMstDTO;
import com.example.MuzPayroll.repository.UserGrpLogRepo;
import com.example.MuzPayroll.repository.UserGrpMstRepo;
import com.example.MuzPayroll.service.UserGrpMstService;

@RestController
@RequestMapping("/userGrp")
@CrossOrigin(origins = "*")
public class UserGrpMstController {

    @Autowired
    private UserGrpMstService userGrpMstService;

    @Autowired
    private UserGrpMstRepo userGrpMstRepo;

    @Autowired
    private UserGrpLogRepo userGrpLogRepo;

    @PostMapping("/save")
    public Response<UserGrpMstDTO> saveUserGrp(@ModelAttribute UserGrpMstDTO dto, @RequestParam String mode) {
        return userGrpMstService.saveWrapper(dto, mode);
    }

    // TO get the location from UserGrpMst by giving MstID
    @GetMapping("/{UgmUserGroupID}")
    public ResponseEntity<UserGrpMst> getUserGrpById(
            @PathVariable @NonNull Long UgmUserGroupID) {

        return userGrpMstRepo.findById(UgmUserGroupID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // TO get the Mst and the List of Logs y using MstID
    @GetMapping("/getamendlist/{UgmUserGroupID}")
    public ResponseEntity<UserGrpMstDTO> getUserGrpByMstId(@NonNull @PathVariable Long UgmUserGroupID) {

        UserGrpMstDTO dto = userGrpMstService.getUserGrpWithLogs(UgmUserGroupID);
        return ResponseEntity.ok(dto);
    }

    // To get the data list from the MST table
    @GetMapping("/userGrplist")
    public ResponseEntity<List<FormListDTO>> getUserGrpList(
            @RequestParam Long companyId,
            @RequestParam(required = false) Boolean activeStatusYN) {

        List<UserGrpMst> list = userGrpMstRepo.findUserGrpByStatus(companyId, activeStatusYN);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getUgmUserGroupID());
                    dto.setCode(entity.getUgmCode());
                    dto.setName(entity.getUgmName());
                    dto.setShortName(entity.getUgmShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getUgmActiveYN());
                    dto.setDescription(entity.getUgmDesc());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

}
