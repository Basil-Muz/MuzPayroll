package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import com.example.MuzPayroll.entity.EntityRightsGrpMst;
import com.example.MuzPayroll.entity.UserGrpMst;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpMstDTO;
import com.example.MuzPayroll.entity.DTO.FormListDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpMstDTO;
import com.example.MuzPayroll.repository.EntityRightsGrpMstRepo;
import com.example.MuzPayroll.service.EntityRightsGrpMstService;

@RestController
@RequestMapping("/locationGrp")
@CrossOrigin(origins = "*")
public class EntityRightsGrpMstController {
    
    @Autowired
    private EntityRightsGrpMstService entityRightsGrpMstService;
    
    @Autowired
    private EntityRightsGrpMstRepo entityRightsGrpMstRepo;

        @PostMapping("/save")
    public Response<EntityRightsGrpMstDTO> saveEntityRightsGrp(@ModelAttribute EntityRightsGrpMstDTO dto, @RequestParam String mode) {
        return entityRightsGrpMstService.saveWrapper(dto, mode);
    }

    // TO get the location from EntityRightsrpMst by giving MstID
    @GetMapping("/{ErmEntityGroupID}")
    public ResponseEntity<EntityRightsGrpMstDTO> getUserGrpById(
            @PathVariable @NonNull Long ErmEntityGroupID) {

                EntityRightsGrpMstDTO dto = entityRightsGrpMstService.getEntityRightsGrpWithAuth(ErmEntityGroupID);
                return ResponseEntity.ok(dto);
        // return userGrpMstRepo.findById(UgmUserGroupID)
        //         .map(ResponseEntity::ok)
        //         .orElse(ResponseEntity.notFound().build());
    }

    // TO get the Mst and the List of Logs y using MstID
    @GetMapping("/getamendlist/{ErmEntityGroupID}")
    public ResponseEntity<EntityRightsGrpMstDTO> getEntityRightsGrpByMstId(@NonNull @PathVariable Long ErmEntityGroupID) {

        EntityRightsGrpMstDTO dto = entityRightsGrpMstService.getEntityRightsGrpWithLogs(ErmEntityGroupID);
        return ResponseEntity.ok(dto);
    }

    // To get the data list from the MST table
    @GetMapping("/locationGrplist")
    public ResponseEntity<List<FormListDTO>> getUserGrpList(
            @RequestParam Long bussinessGroupId,
            @RequestParam(required = false) Boolean activeStatusYN) {

        List<EntityRightsGrpMst> list = entityRightsGrpMstRepo.findEntityRightsGrpByStatus(bussinessGroupId, activeStatusYN);

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getErmEntityGroupID());
                    dto.setCode(entity.getErmCode());
                    dto.setName(entity.getErmName());
                    dto.setShortName(entity.getErmShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    dto.setInactiveDate(entity.getInactiveDate());
                    dto.setActiveStatusYN(entity.getErmActiveYN());
                    dto.setDescription(entity.getErmDesc());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

@GetMapping("/search-locationGroups")
public Page<FormListDTO> searchLocationGroups(
        @RequestParam(required = false) String search,
        @PageableDefault(size = 10) Pageable pageable) {

    Page<EntityRightsGrpMst> page = entityRightsGrpMstRepo.searchEntityRightsGroup(search, pageable);

    return page.map(entity -> {
        FormListDTO dto = new FormListDTO();
        dto.setMstID(entity.getErmEntityGroupID());
        dto.setCode(entity.getErmCode());
        dto.setName(entity.getErmName());
        dto.setShortName(entity.getErmShortName());
        dto.setDescription(entity.getErmDesc());
        dto.setActiveDate(entity.getActiveDate());
        dto.setInactiveDate(entity.getInactiveDate());
        dto.setActiveStatusYN(entity.getErmActiveYN());
        return dto;
    });
}


}
