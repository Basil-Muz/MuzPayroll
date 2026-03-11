package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.DTO.EntityGrpLinkDTO;
import com.example.MuzPayroll.entity.DTO.EntityGrpRightsLinkDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.EntityGrpRightsLink;
import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.EntityRightsGrpMst;
import com.example.MuzPayroll.entity.SolutionMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.EntityGrpRightsLinkRepository;
import com.example.MuzPayroll.repository.EntityRepository;
import com.example.MuzPayroll.repository.EntityRightsGrpMstRepo;
import com.example.MuzPayroll.repository.SolutionRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class EntityGrpRightsLinkService extends MuzirisAbstractService<EntityGrpRightsLinkDTO, EntityGrpRightsLink> {

        @Autowired
        private EntityGrpRightsLinkRepository entityGrpRightsLinkRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private EntityRepository entityRepository;

        @Autowired
        private SolutionRepository solutionRepository;

        @Autowired
        private EntityRightsGrpMstRepo entityRightsGrpMstRepository;

        // ================= FINAL SAVE WRAPPER =================
        @Transactional
        public Response<EntityGrpRightsLinkDTO> saveWrapper(EntityGrpRightsLinkDTO dto, String mode) {
                List<EntityGrpRightsLinkDTO> dtos = new ArrayList<>();
                dtos.add(dto);
                return save(dtos, mode);
        }

        // =================== 1️⃣ ENTITY VALIDATION ===================
        @Override
        public Response<Boolean> entityValidate(List<EntityGrpRightsLinkDTO> dtos, String mode) {

                if (dtos == null || dtos.isEmpty()) {
                        return Response.error("DTO cannot be null or empty");
                }

                List<String> errors = new ArrayList<>();
                boolean hasAnyError = false;

                for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
                        EntityGrpRightsLinkDTO dto = dtos.get(rowIndex);
                        int rowNumber = rowIndex + 1;

                        List<String> rowErrors = new ArrayList<>();

                        // Check if this row (DTO) is null
                        if (dto == null) {
                                errors.add("Row " + rowNumber + ": DTO object is null");
                                hasAnyError = true;
                                continue; // Skip to next row
                        }

                        // Collect ALL errors

                        if (dto.getEglEntityHierarchyID() == null) {
                                rowErrors.add("Entity ID is required");
                        }

                        // if (dto.getEglEntityGroupRightsIDs() == null) {
                        //         rowErrors.add("Group ID is required");
                        // }

                        if (dto.getEglSolutionID() == null) {
                                rowErrors.add("Solution is required");
                        }
                        if (dto.getLastModUserId() == null)
                                rowErrors.add("User ID is required");

                        if (dto.getEglLastModDate() == null)
                                rowErrors.add("Last Mod date is required");

                        // Add row errors to main error list with row number
                        if (!rowErrors.isEmpty()) {
                                hasAnyError = true;

                                // Create a prefix for this row's errors
                                String rowPrefix = "Row " + rowNumber;
                                if ((dto.getEglEntityHierarchyID() != null)) {
                                        rowPrefix += " (Entity ID: " + dto.getEglEntityHierarchyID()
                                                        + ")";
                                }

                                for (String error : rowErrors) {
                                        errors.add(rowPrefix + ": " + error);
                                }
                        }

                        // Return result
                        if (hasAnyError) {
                                return Response.error(errors);
                        }
                }

                return Response.success(true);
        }

        // =================== 2️⃣ ENTITY POPULATE ===================
        @Override
        public Response<Boolean> entityPopulate(List<EntityGrpRightsLinkDTO> dtos, String mode) {

                List<String> errors = new ArrayList<>();
                EntityGrpRightsLinkDTO dto = dtos.get(0);

                UserMst user = userRepository.findByUserMstID(dto.getLastModUserId())
                                .orElseThrow(() -> new RuntimeException("Invalid user ID"));

                if (!errors.isEmpty()) {
                        return Response.error(errors);
                }

                return Response.success(true);

        }

        // =================== 3️⃣ BUSINESS VALIDATION ===================
        @Override
        public Response<Boolean> businessValidate(List<EntityGrpRightsLinkDTO> dtos, String mode) {

                if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
                        EntityGrpRightsLinkDTO dto = dtos.get(0);

                        List<String> errors = new ArrayList<>();

                        if (!errors.isEmpty()) {
                                return Response.error(errors);
                        }

                }
                return Response.success(true);
        }

        // =================== 4️⃣ GENERATE PK ===================
        @Override
        public Response<Object> generatePK(List<EntityGrpRightsLinkDTO> dtos, String mode) {
                List<String> errors = new ArrayList<>();

                if (dtos == null || dtos.isEmpty()) {
                        return Response.error("No Entity data provided");
                }

                return Response.success(true);

        }

        // =================== 5️⃣ GENERATE SERIAL NO ===================
        @Override
        public Response<String> generateSerialNo(List<EntityGrpRightsLinkDTO> dtos, String mode) {

                List<String> errors = new ArrayList<>();
                EntityGrpRightsLinkDTO dto = dtos.get(0);

                if (!errors.isEmpty()) {
                        return Response.error(errors);
                }

                return Response.success("");

        }

        // =================== 6️⃣ converttoEntity ===================
        @Override
        public Response<EntityGrpRightsLink> converttoEntity(List<EntityGrpRightsLinkDTO> dtos) {

                // ===== CREATE COMPANY ENTITY =====
                EntityGrpRightsLink entity = dtoToEntity(dtos);

                return Response.success(entity);

        }

        // =================== DTO → ENTITY ===================
        @Override
        protected EntityGrpRightsLink dtoToEntity(List<EntityGrpRightsLinkDTO> dtos) {
                if (dtos == null || dtos.isEmpty()) {
                        return null;
                }

                // Take the first DTO from the list
                EntityGrpRightsLinkDTO dto = dtos.get(0);

                EntityGrpRightsLink entity = new EntityGrpRightsLink();

                // Set ALL fields from the first DTO

                UserMst user = userRepository.findByUserMstID(dto.getLastModUserId())
                                .orElseThrow(() -> new RuntimeException("Invalid user ID"));
                entity.setUserMst(user);

                EntityMst entityMst = entityRepository.findById(dto.getEglEntityHierarchyID())
                                .orElseThrow(() -> new RuntimeException("Invalid Entity ID"));

                entity.setEntityMst(entityMst);

                SolutionMst solutionMst = solutionRepository.findById(dto.getEglSolutionID())
                                .orElseThrow(() -> new RuntimeException("Invalid Entity ID"));
                entity.setSolutionMst(solutionMst);

                // EntityRightsGrpMst entityRightsGrpMst = entityRightsGrpMstRepository
                // .findById(dto.getEglEntityGroupRightsID())
                // .orElseThrow(() -> new RuntimeException("Invalid Gtoup ID"));

                // entity.setEntityRightsGrpMst(entityRightsGrpMst);

                entity.setEglLastModDate(dto.getEglLastModDate());

                entity.setEntityGrpRightsLinkID(dto.getEntityGrpRightsLinkID());

                return entity;
        }

        // =================== ENTITY → DTO ===================

        @Override
        public EntityGrpRightsLinkDTO entityToDto(EntityGrpRightsLink entity) {

                EntityGrpRightsLinkDTO dto = new EntityGrpRightsLinkDTO();

                dto.setEntityGrpRightsLinkID(entity.getEntityGrpRightsLinkID());
                dto.setLastModUserId(entity.getUserMst().getUserMstID());
                dto.setEglLastModDate(entity.getEglLastModDate());
                dto.setEglEntityHierarchyID(entity.getEntityMst().getEtmEntityId());
                dto.setEglSolutionID(entity.getSolutionMst().getSomSolutionID());
                // dto.setEglEntityGroupRightsID(entity.getEntityRightsGrpMst().getErmEntityGroupID());

                return dto;
        }

        // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
        @Override
        @Transactional(rollbackFor = Exception.class)
        protected EntityGrpRightsLink saveEntity(EntityGrpRightsLink entity, List<EntityGrpRightsLinkDTO> dtos,
                        String mode) {

                EntityGrpRightsLinkDTO dto = dtos.get(0);
                EntityGrpRightsLink savedEntity = null;

                if ("INSERT".equalsIgnoreCase(mode)) {

                        // Delete all existing mappings for this entity + solution
                        entityGrpRightsLinkRepository
                                        .deleteByEntityMst_EtmEntityIdAndSolutionMst_SomSolutionID(
                                                        dto.getEglEntityHierarchyID(),
                                                        dto.getEglSolutionID());

                        // If no groups selected just return a dummy entity for DTO conversion
                        if (dto.getEglEntityGroupRightsIDs() == null ||
                                        dto.getEglEntityGroupRightsIDs().isEmpty()) {

                                savedEntity = new EntityGrpRightsLink();
                                savedEntity.setEntityMst(entity.getEntityMst());
                                savedEntity.setSolutionMst(entity.getSolutionMst());
                                savedEntity.setUserMst(entity.getUserMst());
                                savedEntity.setEglLastModDate(entity.getEglLastModDate());

                                return savedEntity;
                        }

                        // Insert new mappings
                        for (Long groupId : dto.getEglEntityGroupRightsIDs()) {

                                EntityGrpRightsLink newEntity = new EntityGrpRightsLink();

                                newEntity.setEntityMst(entity.getEntityMst());
                                newEntity.setSolutionMst(entity.getSolutionMst());
                                newEntity.setUserMst(entity.getUserMst());
                                newEntity.setEglLastModDate(entity.getEglLastModDate());

                                EntityRightsGrpMst rightsGroup = entityRightsGrpMstRepository.findById(groupId)
                                                .orElseThrow(() -> new RuntimeException("Invalid Group ID"));

                                newEntity.setEntityRightsGrpMst(rightsGroup);

                                savedEntity = entityGrpRightsLinkRepository.save(newEntity);
                        }
                }

                return savedEntity;
        }
        // =================== 9️⃣ UTILITY METHODS ===================

        private boolean isEmpty(String str) {
                return str == null || str.trim().isEmpty();
        }

        public List<EntityGrpLinkDTO> getData(Long solutionId, List<Long> branchIds) {

                List<Object[]> rows = entityGrpRightsLinkRepository.getEntityGrpRightsLinkData(
                                solutionId,
                                branchIds.toArray(new Long[0]));

                Map<Long, EntityGrpLinkDTO> map = new LinkedHashMap<>();

                for (Object[] r : rows) {

                        Long linkId = r[0] != null ? ((Number) r[0]).longValue() : null;
                        Long branchId = r[1] != null ? ((Number) r[1]).longValue() : null;
                        String branchName = (String) r[2];
                        Long locationId = r[3] != null ? ((Number) r[3]).longValue() : null;
                        String locationName = (String) r[4];
                        Long groupId = r[5] != null ? ((Number) r[5]).longValue() : null;

                        EntityGrpLinkDTO dto = map.get(locationId);

                        if (dto == null) {
                                dto = new EntityGrpLinkDTO();
                                dto.setLinkId(linkId);
                                dto.setBranchId(branchId);
                                dto.setBranchName(branchName);
                                dto.setEntityHierarchyId(locationId);
                                dto.setLocationName(locationName);
                                dto.setGroupId(new ArrayList<>());

                                map.put(locationId, dto);
                        }

                        if (groupId != null) {
                                dto.getGroupId().add(groupId);
                        }
                }

                return new ArrayList<>(map.values());
        }

}
