package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.type.descriptor.java.LocalDateJavaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityGrpRights;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.EntityRightsGrpMst;
import com.example.MuzPayroll.entity.OptionMst;
import com.example.MuzPayroll.entity.SolutionMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;
import com.example.MuzPayroll.entity.DTO.EntityLogDTO;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpLogDTO;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpMstDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.EntityGrpRightsRepository;
import com.example.MuzPayroll.repository.EntityRightsGrpMstRepo;
import com.example.MuzPayroll.repository.OptionMstRepository;
import com.example.MuzPayroll.repository.SolutionRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class EntityGrpRightsService extends MuzirisAbstractService<EntityGrpRightsDTO, EntityGrpRights>{

    @Autowired
    EntityGrpRightsRepository locationEntityGrpRightsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OptionMstRepository optionMstRepository;

    @Autowired
    private EntityRightsGrpMstRepo entityRightsGrpMstRepo;

    @Autowired
    private SolutionRepository solutionRepository;

    @Transactional
    public Response<EntityGrpRightsDTO> saveWrapper( List<EntityGrpRightsDTO> dto, String mode) {
        List<EntityGrpRightsDTO> dtos = new ArrayList<>();
           for (EntityGrpRightsDTO tdto : dto) {
            dtos.add(tdto);
           }
        return save(dtos, mode);
    }
      
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
        dto.setSolutionMstId(entity.getSolutionMst().getSomSolutionID());
        dto.setOptionMstId(entity.getOptionMst().getOpmOptionID());
        dto.setLastModUserId(entity.getUserMst().getUserMstID());
        dto.setEntityRightsGrpMstId(entity.getEntityRightsGrpMst().getErmEntityGroupID());
        return dto;
    }).toList();
    }
    @Override
    public Response<Boolean> entityValidate(List<EntityGrpRightsDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    EntityGrpRightsDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (dto.getEgrEntityGroupRightID()==null)
                        rowErrors.add("Entity Group right Id is required");
                    if (dto.getEgrAdd()==null)
                        rowErrors.add("Add is required");
                    if (dto.getEgrEdit()==null)
                        rowErrors.add("Edit is required");
                    if (dto.getEgrDelete()==null)
                        rowErrors.add("Delete is required");
                    if (dto.getEgrPrint()==null)
                        rowErrors.add("Print is required");
                    if (dto.getLastModUserId()==null)
                        rowErrors.add("User Id is required");

                    // Add row errors to main error list with row number
                    // if (!rowErrors.isEmpty()) {
                    //     hasAnyError = true;

                    //     // Create a prefix for this row's errors
                    //     String rowPrefix = "Row " + rowNumber;
                    //     if (!isEmpty(dto.getErmName())) {
                    //         rowPrefix += " (Location: " + dto.getErmName() + ")";
                    //     }

                    //     for (String error : rowErrors) {
                    //         errors.add(rowPrefix + ": " + error);
                    //     }
                    // }
                    // Return result
                    if (hasAnyError) {
                        return Response.error(errors);
                    }
                }
            }

        return Response.success(true);
    }
    @Override
    public Response<Boolean> entityPopulate(List<EntityGrpRightsDTO> dtos, String mode) {
       return Response.success(true);
    }
    @Override
    public Response<Boolean> businessValidate(List<EntityGrpRightsDTO> dtos, String mode) {
        return Response.success(true);
    }
    @Override
    public Response<Object> generatePK(List<EntityGrpRightsDTO> dtos, String mode) {
        return Response.success(true);
    }
    @Override
    public Response<String> generateSerialNo(List<EntityGrpRightsDTO> dtos, String mode) {
          return Response.success("");
    }
    @Override
    public Response<EntityGrpRights> converttoEntity(List<EntityGrpRightsDTO> dtos) {
         EntityGrpRights entity = new EntityGrpRights();
        return Response.success(entity);
        
    }
    @Override
    protected EntityGrpRights saveEntity(EntityGrpRights entity, List<EntityGrpRightsDTO> dtos, String mode) {
           List<EntityGrpRights> entities = new ArrayList<>();
        for (EntityGrpRightsDTO dto : dtos) {
               entities.add(dtoToEntity(dto));
        }
         List<EntityGrpRights> savedEntities = locationEntityGrpRightsRepository.saveAll(entities);
         return savedEntities.get(savedEntities.size() - 1); // return any one entity;
    }

     // =================== DTO → ENTITY ===================
    // @Override
    protected EntityGrpRights dtoToEntity(EntityGrpRightsDTO dto) {
        if (dto == null) {
            return null;
        }
        // Take the first DTO from the list
        // EntityGrpRightsDTO dto = dtos.get(0);

            EntityGrpRights entity = new EntityGrpRights();
            // Set ALL fields from the first DTO
            entity.setEgrEntityGroupRightID(dto.getEgrEntityGroupRightID());
            entity.setEgrAdd(dto.getEgrAdd());
            entity.setEgrEdit(dto.getEgrEdit());
            entity.setEgrView(dto.getEgrView());
            entity.setEgrDelete(dto.getEgrDelete());
            entity.setEgrPrint(dto.getEgrPrint());
            entity.setEgrLastModDate(LocalDate.now());
            entity.setEgrEntityGroupRightID(dto.getEgrEntityGroupRightID());

            if (dto.getLastModUserId() != null) {
                UserMst userId = userRepository.findByUserMstId(dto.getLastModUserId());
                entity.setUserMst(userId);
            }
            if (dto.getOptionMstId() != null) {
                OptionMst optionId = optionMstRepository.findByOptionMstId(dto.getOptionMstId());
                entity.setOptionMst(optionId);
            }
             if (dto.getEntityRightsGrpMstId() != null) {
                EntityRightsGrpMst entityRightsGrpId = entityRightsGrpMstRepo.findByEntityRightsGrpId(dto.getEntityRightsGrpMstId());
                entity.setEntityRightsGrpMst(entityRightsGrpId);
            }
            if (dto.getSolutionMstId() != null) {
                SolutionMst solutionMstId = solutionRepository.findBySolutionMstId(dto.getSolutionMstId());
                entity.setSolutionMst(solutionMstId);
            }
             
        return entity;
    }
    @Override
    public EntityGrpRightsDTO entityToDto(EntityGrpRights entity) {
        EntityGrpRightsDTO dto = new EntityGrpRightsDTO();
        dto.setEntityRightsGrpMstId(entity.getEntityRightsGrpMst().getErmEntityGroupID());
        dto.setEgrEntityGroupRightID(entity.getEgrEntityGroupRightID());
        dto.setEgrAdd(entity.getEgrAdd());
        dto.setEgrEdit(entity.getEgrEdit());
        dto.setEgrView(entity.getEgrView());
        dto.setEgrDelete(entity.getEgrDelete());
        dto.setEgrPrint(entity.getEgrPrint());
        dto.setEgrLastModDate(LocalDate.now());
        dto.setLastModUserId(entity.getUserMst().getUserMstID());
        dto.setOptionMstId(entity.getOptionMst().getOpmOptionID());
        dto.setSolutionMstId(entity.getSolutionMst().getSomSolutionID());

        return dto;
    }
}