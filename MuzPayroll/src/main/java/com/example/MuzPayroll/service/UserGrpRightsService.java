package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.example.MuzPayroll.entity.OptionMst;
import com.example.MuzPayroll.entity.SolutionMst;
import com.example.MuzPayroll.entity.UserGrpMst;
import com.example.MuzPayroll.entity.UserGrpRights;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserGrpRightsDTO;
import com.example.MuzPayroll.repository.OptionMstRepository;
import com.example.MuzPayroll.repository.SolutionRepository;
import com.example.MuzPayroll.repository.UserGrpMstRepo;
import com.example.MuzPayroll.repository.UserGrpRightsRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class UserGrpRightsService extends MuzirisAbstractService<UserGrpRightsDTO, UserGrpRights>{
    
    @Autowired
    private UserGrpRightsRepository userGrpRightsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGrpMstRepo userGrpMstRepo;

    @Autowired
    private OptionMstRepository optionMstRepository;

    @Autowired
    private SolutionRepository solutionRepository;

     @Transactional
    public Response<UserGrpRightsDTO> saveWrapper( List<UserGrpRightsDTO> dto, String mode) {
        List<UserGrpRightsDTO> dtos = new ArrayList<>();
           for (UserGrpRightsDTO tdto : dto) {
            dtos.add(tdto);
           }
        return save(dtos, mode);
    }

    public List<UserGrpRightsDTO> getRights(Long userGroupId, Long solutionId) {
    List<UserGrpRights> rights =
            userGrpRightsRepository.findRights(
                    userGroupId,
                    solutionId
            );

     return rights.stream().map(entity -> {
        UserGrpRightsDTO dto = new UserGrpRightsDTO();
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
        dto.setUgrUserGroupRightID(entity.getUserGrpRightsID());
        dto.setUgrAdd(entity.getUgrAdd());
        dto.setUgrEdit(entity.getUgrEdit());
        dto.setUgrView(entity.getUgrView());
        dto.setUgrDelete(entity.getUgrDelete());
        dto.setUgrPrint(entity.getUgrPrint());
        dto.setSolutionMstId(entity.getSolutionMst().getSomSolutionID());
        dto.setOptionMstId(entity.getOptionMst().getOpmOptionID());
        dto.setLastModUserId(entity.getUserMst().getUserMstID());
        dto.setUserGroupId(entity.getUserGrpMst().getUgmUserGroupID());
        return dto;
    }).toList();
    }
    @Override
    public Response<Boolean> entityValidate(List<UserGrpRightsDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                    UserGrpRightsDTO dto = dtos.get(rowIndex);
                    int rowNumber = rowIndex + 1;

                    List<String> rowErrors = new ArrayList<>();

                    // Check if this row (DTO) is null
                    if (dto == null) {
                        errors.add("Row " + rowNumber + ": DTO object is null");
                        hasAnyError = true;
                        continue; // Skip to next row
                    }

                    // Collect ALL errors
                    if (dto.getUgrUserGroupRightID() ==null)
                        rowErrors.add("Entity Group right Id is required");
                    if (dto.getUgrAdd()==null)
                        rowErrors.add("Add is required");
                    if (dto.getUgrEdit()==null)
                        rowErrors.add("Edit is required");
                    if (dto.getUgrDelete()==null)
                        rowErrors.add("Delete is required");
                    if (dto.getUgrPrint()==null)
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
    public Response<Boolean> entityPopulate(List<UserGrpRightsDTO> dtos, String mode) {
       return Response.success(true);
    }
    @Override
    public Response<Boolean> businessValidate(List<UserGrpRightsDTO> dtos, String mode) {
        return Response.success(true);
    }
    @Override
    public Response<Object> generatePK(List<UserGrpRightsDTO> dtos, String mode) {
        return Response.success(true);
    }
    @Override
    public Response<String> generateSerialNo(List<UserGrpRightsDTO> dtos, String mode) {
          return Response.success("");
    }
    @Override
    public Response<UserGrpRights> converttoEntity(List<UserGrpRightsDTO> dtos) {
         UserGrpRights entity = new UserGrpRights();
        return Response.success(entity);
        
    }
    @Override
    protected UserGrpRights saveEntity(UserGrpRights entity, List<UserGrpRightsDTO> dtos, String mode) {
           List<UserGrpRights> entities = new ArrayList<>();
        for (UserGrpRightsDTO dto : dtos) {
               entities.add(dtoToEntity(dto));
        }
         List<UserGrpRights> savedEntities = userGrpRightsRepository.saveAll(entities);
         return savedEntities.get(savedEntities.size() - 1); // return any one entity;
    }

     // =================== DTO → ENTITY ===================
    // @Override
    protected UserGrpRights dtoToEntity(UserGrpRightsDTO dto) {
        if (dto == null) {
            return null;
        }
        // Take the first DTO from the list
        // EntityGrpRightsDTO dto = dtos.get(0);

            UserGrpRights entity = new UserGrpRights();
            // Set ALL fields from the first DTO
            entity.setUserGrpRightsID (dto.getUgrUserGroupRightID());
            entity.setUgrAdd(dto.getUgrAdd());
            entity.setUgrEdit(dto.getUgrEdit());
            entity.setUgrView(dto.getUgrView());
            entity.setUgrDelete(dto.getUgrDelete());
            entity.setUgrPrint(dto.getUgrPrint());
            entity.setUgrLastModDate(LocalDate.now());

            if (dto.getLastModUserId() != null) {
                UserMst userId = userRepository.findByUserMstId(dto.getLastModUserId());
                entity.setUserMst(userId);
            }
            if (dto.getOptionMstId() != null) {
                OptionMst optionId = optionMstRepository.findByOptionMstId(dto.getOptionMstId());
                entity.setOptionMst(optionId);
            }
             if (dto.getUserGroupId() != null) {
                UserGrpMst entityRightsGrpId = userGrpMstRepo.findByUserGrpRightsId(dto.getUserGroupId());
                entity.setUserGrpMst(entityRightsGrpId);
            }
            if (dto.getSolutionMstId() != null) {
                SolutionMst solutionMstId = solutionRepository.findBySolutionMstId(dto.getSolutionMstId());
                entity.setSolutionMst(solutionMstId);
            }
             
        return entity;
    }
    @Override
    public UserGrpRightsDTO entityToDto(UserGrpRights entity) {
        UserGrpRightsDTO dto = new UserGrpRightsDTO();
        dto.setUserGroupId(entity.getUserGrpMst().getUgmUserGroupID());
        dto.setUgrUserGroupRightID(entity.getUserGrpRightsID() );
        dto.setUgrAdd(entity.getUgrAdd());
        dto.setUgrEdit(entity.getUgrEdit());
        dto.setUgrView(entity.getUgrView());
        dto.setUgrDelete(entity.getUgrDelete());
        dto.setUgrPrint(entity.getUgrPrint());
        dto.setUgrLastModDate(LocalDate.now());
        dto.setLastModUserId(entity.getUserMst().getUserMstID());
        dto.setOptionMstId(entity.getOptionMst().getOpmOptionID());
        dto.setSolutionMstId(entity.getSolutionMst().getSomSolutionID());

        return dto;
    }
}
