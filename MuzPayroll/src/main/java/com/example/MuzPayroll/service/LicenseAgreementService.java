package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.EntityMst;
import com.example.MuzPayroll.entity.LicenseAgreement;

import com.example.MuzPayroll.entity.DTO.LicenseAgreementDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.EntityRepository;
import com.example.MuzPayroll.repository.LicenseAgreementRepository;

@Service
public class LicenseAgreementService extends MuzirisAbstractService<LicenseAgreementDTO, LicenseAgreement> {

    @Autowired
    private LicenseAgreementRepository licenseAgreementRepository;

    @Autowired
    private EntityRepository entityRepository;

    // ================= FINAL SAVE WRAPPER =================
    @Transactional
    public Response<LicenseAgreementDTO> saveWrapper(LicenseAgreementDTO dto, String mode) {
        List<LicenseAgreementDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        return save(dtos, mode);
    }

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<LicenseAgreementDTO> dtos, String mode) {

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("DTO cannot be null or empty");
        }

        List<String> errors = new ArrayList<>();
        boolean hasAnyError = false;

        for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
            LicenseAgreementDTO dto = dtos.get(rowIndex);
            int rowNumber = rowIndex + 1;

            List<String> rowErrors = new ArrayList<>();

            // Check if this row (DTO) is null
            if (dto == null) {
                errors.add("Row " + rowNumber + ": DTO object is null");
                hasAnyError = true;
                continue; // Skip to next row
            }

            // Collect ALL errors

            if (dto.getLicEntityHierarchyID() == null) {
                rowErrors.add("Entity ID is required");
            }

            // Add row errors to main error list with row number
            if (!rowErrors.isEmpty()) {
                hasAnyError = true;

                // Create a prefix for this row's errors
                String rowPrefix = "Row " + rowNumber;
                if ((dto.getLicEntityHierarchyID() != null)) {
                    rowPrefix += " (Entity ID: " + dto.getLicEntityHierarchyID()
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
    public Response<Boolean> entityPopulate(List<LicenseAgreementDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        LicenseAgreementDTO dto = dtos.get(0);

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);

    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<LicenseAgreementDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
            LicenseAgreementDTO dto = dtos.get(0);

            List<String> errors = new ArrayList<>();

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }

        }
        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(List<LicenseAgreementDTO> dtos, String mode) {
        List<String> errors = new ArrayList<>();

        if (dtos == null || dtos.isEmpty()) {
            return Response.error("No Entity data provided");
        }

        return Response.success(true);

    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<LicenseAgreementDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();
        LicenseAgreementDTO dto = dtos.get(0);

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success("");

    }

    // =================== 6️⃣ converttoEntity ===================
    @Override
    public Response<LicenseAgreement> converttoEntity(List<LicenseAgreementDTO> dtos) {

        // ===== CREATE COMPANY ENTITY =====
        LicenseAgreement entity = dtoToEntity(dtos);

        return Response.success(entity);

    }

    // =================== DTO → ENTITY ===================
    @Override
    protected LicenseAgreement dtoToEntity(List<LicenseAgreementDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return null;
        }

        // Take the first DTO from the list
        LicenseAgreementDTO dto = dtos.get(0);

        // Set ALL fields from the first DTO

        EntityMst entityMst = entityRepository.findById(dto.getLicEntityHierarchyID())
                .orElseThrow(() -> new RuntimeException("Invalid Entity ID"));

        LicenseAgreement entity = licenseAgreementRepository
                .findById(dto.getLicEntityHierarchyID())
                .orElse(new LicenseAgreement());

        entity.setEntityMst(entityMst);
        entity.setLicBranchs(dto.getLicBranchs());
        entity.setLicLocations(dto.getLicLocations());
        entity.setLicUsers(dto.getLicUsers());

        return entity;
    }

    // =================== ENTITY → DTO ===================

    @Override
    public LicenseAgreementDTO entityToDto(LicenseAgreement entity) {

        LicenseAgreementDTO dto = new LicenseAgreementDTO();

        dto.setLicEntityHierarchyID(entity.getEntityMst().getEtmEntityId());
        dto.setLicBranchs(entity.getLicBranchs());
        dto.setLicLocations(entity.getLicLocations());
        dto.setLicUsers(entity.getLicUsers());
        // dto.setEglEntityGroupRightsID(entity.getEntityRightsGrpMst().getErmEntityGroupID());

        return dto;
    }

    // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected LicenseAgreement saveEntity(LicenseAgreement entity, List<LicenseAgreementDTO> dtos,
            String mode) {

        LicenseAgreementDTO dto = dtos.get(0);
        LicenseAgreement savedEntity = null;

        savedEntity = licenseAgreementRepository.save(entity);

        return savedEntity;
    }
    // =================== 9️⃣ UTILITY METHODS ===================

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public List<LicenseAgreementDTO> getData(Long companyId) {

        List<Object[]> rows = licenseAgreementRepository.getLicenseAgreementData(
                companyId);

        Map<Long, LicenseAgreementDTO> map = new LinkedHashMap<>();

        for (Object[] r : rows) {

            Long company = r[0] != null ? ((Number) r[0]).longValue() : null;
            Long branches = r[1] != null ? ((Number) r[1]).longValue() : null;
            Long locations = r[2] != null ? ((Number) r[2]).longValue() : null;
            Long users = r[3] != null ? ((Number) r[3]).longValue() : null;

            LicenseAgreementDTO dto = map.get(companyId);

            if (dto == null) {
                dto = new LicenseAgreementDTO();
                dto.setLicEntityHierarchyID(company);
                dto.setLicBranchs(branches);
                dto.setLicLocations(locations);
                dto.setLicUsers(users);
                map.put(companyId, dto);
            }

        }

        return new ArrayList<>(map.values());
    }
}
