package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.EntityGrpRights;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;
import com.example.MuzPayroll.repository.EntityGrpRightsRepository;

@Service
public class EntityGrpRightsService {

    @Autowired
    EntityGrpRightsRepository locationEntityGrpRightsRepository;

    public List<EntityGrpRightsDTO> getRights(Long entityGroupId, Long solutionId) {
    List<EntityGrpRights> rights =
            locationEntityGrpRightsRepository.findRights(
                    entityGroupId,
                    solutionId
            );

     return rights.stream().map(entity -> {
        EntityGrpRightsDTO dto = new EntityGrpRightsDTO();
        // if (dto.getEntityHierarchyInfoID() != null) {
        //     EntityHierarchyInfo hierarchy =
        //         entityHierarchyInfoRepository.findById(
        //                 dto.getEntityHierarchyInfoID()
        //         ).orElseThrow(() ->
        //                 new RuntimeException("Hierarchy not found"));

        //     entity.setEntityHierarchyInfoID(hierarchy);
        // }
          if (entity.getOptionMst() != null) {
            dto.setOptionCode(
                entity.getOptionMst().getOpmName()
            );
             dto.setOptionType(
                entity.getOptionMst().getOpmOptionType()
            );
        }

        dto.setModuleName(entity.getOptionMst().getModuleEntity().getMomModuleName());

        dto.setEgrEntityGroupRightID(entity.getEgrEntityGroupRightID());
        dto.setEgrAdd(entity.getEgrAdd());
        dto.setEgrEdit(entity.getEgrEdit());
        dto.setEgrView(entity.getEgrView());
        dto.setEgrDelete(entity.getEgrDelete());
        dto.setEgrPrint(entity.getEgrPrint());
        return dto;
    }).toList();
}
}
