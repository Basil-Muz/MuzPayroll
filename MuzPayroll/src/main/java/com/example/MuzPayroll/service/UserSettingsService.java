package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.MuzPayroll.repository.UserGrpMstRepo;
import com.example.MuzPayroll.entity.AddressInfoMst;
import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityGrpRights;
import com.example.MuzPayroll.entity.EntityHierarchyInfo;
import com.example.MuzPayroll.entity.UserAndEntityLink;
import com.example.MuzPayroll.entity.UserAndUserGroupLink;
import com.example.MuzPayroll.entity.UserGrpMst;
import com.example.MuzPayroll.entity.DTO.EntityDTO;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsDTO;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsLinkDTO;
import com.example.MuzPayroll.entity.DTO.EntityRightsGrpMstDTO;
import com.example.MuzPayroll.entity.DTO.GroupDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserSettingsResponseDTO;
import com.example.MuzPayroll.repository.EntityHierarchyInfoRepository;
import com.example.MuzPayroll.repository.UserAndEntityLinkRepository;
import com.example.MuzPayroll.repository.UserAndUserGroupLinkRepositoty;
import com.example.MuzPayroll.repository.UserRepository;
import com.example.MuzPayroll.repository.UserTypeMstRepository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserSettingsService extends MuzirisAbstractService<UserSettingsResponseDTO, UserAndUserGroupLink> {
    @Autowired
    private UserAndEntityLinkRepository userAndEntityLinkRepository;

    @Autowired
    private UserAndUserGroupLinkRepositoty userAndUserGroupLinkRepositoty;

    @Autowired
    private UserGrpMstRepo UserGrpMstRepo;

    @Autowired
    private EntityHierarchyInfoRepository entityHierarchyInfoRepository;

    @Autowired
    UserTypeMstRepository userTypeMstRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper mapper;

    public List<UserSettingsResponseDTO> fetchAllData(Long companyId, String userCode, List<Long> userTypeId,
            List<Long> userGrpId, List<Long> locationId) {
        List<Object[]> rows = userTypeMstRepository.findList(companyId, userCode, userTypeId, userGrpId, locationId);
        return rows.stream().map(r -> {

            UserSettingsResponseDTO dto = new UserSettingsResponseDTO();

            dto.setId(((Number) r[0]).longValue());
            dto.setName((String) r[1]);
            dto.setCode((String) r[2]);

            try {

                List<GroupDTO> groups = mapper.readValue((String) r[3],
                        new TypeReference<List<GroupDTO>>() {
                        });

                List<EntityDTO> entities = mapper.readValue((String) r[4],
                        new TypeReference<List<EntityDTO>>() {
                        });

                dto.setGroups(groups);
                dto.setEntity(entities);

            } catch (Exception e) {
                e.printStackTrace();
            }

            return dto;

        }).toList();
    }

    public Response<UserSettingsResponseDTO> saveWrapper(UserSettingsResponseDTO dto, String mode) {
        List<UserSettingsResponseDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        return save(dtos, mode);
    }

    @Override
    public Response<Boolean> entityValidate(List<UserSettingsResponseDTO> dtos, String mode) {
        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null || dtos.isEmpty()) {
                return Response.error("DTO cannot be null or empty");
            }

            List<String> errors = new ArrayList<>();
            boolean hasAnyError = false;

            for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                UserSettingsResponseDTO dto = dtos.get(rowIndex);
                int rowNumber = rowIndex + 1;

                List<String> rowErrors = new ArrayList<>();

                // Check if this row (DTO) is null
                if (dto == null) {
                    errors.add("Row " + rowNumber + ": DTO object is null");
                    hasAnyError = true;
                    continue; // Skip to next row
                }

                // Collect ALL errors
                if (dto.getId() == null)
                    rowErrors.add("User Id is required");

                // Return result
                if (hasAnyError) {
                    return Response.error(errors);
                }
            }
        }

        return Response.success(true);
    }

    @Override
    public Response<Boolean> entityPopulate(List<UserSettingsResponseDTO> dtos, String mode) {
        for (UserSettingsResponseDTO dto : dtos) {

                    UserAndEntityLink userEntity = new UserAndEntityLink();

                    if (dto.getId() != null) {
                        userEntity.setUserMst(
                                userRepository.findByUserMstId(dto.getId()));
                    }

            // if (dto.getGroups() != null && !dto.getGroups().isEmpty()) {

            //     for (GroupDTO groupDTO : dto.getGroups()) {

            //         UserAndUserGroupLink userGrp = new UserAndUserGroupLink();

            //         if (dto.getId() != null) {
            //             userGrp.setUserMst(
            //                     userRepository.findByUserMstId(dto.getId()));
            //         }

            //         UserGrpMst group = UserGrpMstRepo.findByUserGrpRightsId(groupDTO.getId());

            //         userGrp.setUserGrpMst(group);
            //     }
            // }
            // userEntity.getEntityHierarchyInfo()
            // auth.setAuthorizationDate(dto.getAuthorizationDate());
            // auth.setAuthorizationStatus(dto.getAuthorizationStatus());
            // auth.setUserMst(user);
            // // Store authorization temporarily
            // dto.setAuthorization(auth);
        }
        return Response.success(true);
    }

    @Override
    public Response<Boolean> businessValidate(List<UserSettingsResponseDTO> dtos, String mode) {
        return Response.success(true);
    }

    @Override
    public Response<Object> generatePK(List<UserSettingsResponseDTO> dtos, String mode) {
        return Response.success(true);
    }

    @Override
    public Response<String> generateSerialNo(List<UserSettingsResponseDTO> dtos, String mode) {
        return Response.success("");
    }

    @Override
    protected UserAndUserGroupLink saveEntity(UserAndUserGroupLink entity, List<UserSettingsResponseDTO> dtos,
            String mode) {
                List<UserAndEntityLink> userAndEntityLinkList =  new ArrayList<>();
                for (UserSettingsResponseDTO dto : dtos) {
                if (dto.getGroups() != null && !dto.getGroups().isEmpty()) {

                for (GroupDTO groupDTO : dto.getGroups()) {

                    UserAndUserGroupLink userGrp = new UserAndUserGroupLink();

                    if (dto.getId() != null) {
                        userGrp.setUserMst(
                                userRepository.findByUserMstId(dto.getId()));
                    }

                    // UserGrpMst group = userAndUserGroupLinkRepositoty.findByUserGrpRightsId(groupDTO.getId());

                    // userGrp.setUserGrpMst(group);
                }
            }
        }
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'saveEntity'");
    }

    @Override
    public Response<UserAndUserGroupLink> converttoEntity(List<UserSettingsResponseDTO> dtos) {
        UserAndUserGroupLink group = new UserAndUserGroupLink();
      
                // UserSettingsResponseDTO dto = dtos.get(0);
                //     if (dto.getId() != null) {
                //         group.setUserMst(
                //                 userRepository.findByUserMstId(dto.getId()));
                //     }
                    

        return Response.success(group);
    }

}
