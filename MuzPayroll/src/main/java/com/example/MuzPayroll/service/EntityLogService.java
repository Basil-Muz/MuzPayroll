package com.example.MuzPayroll.service;

import com.example.MuzPayroll.repository.EntityLogRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.AddressInfoLog;
import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.EntityLog;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.EntityLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class EntityLogService extends MuzirisAbstractService<EntityLogDTO, EntityLog> {

    @Autowired
    private EntityLogRepository entityLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<EntityLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            if (dtos == null)
                return Response.error("DTO cannot be null");
            List<String> errors = new ArrayList<>();

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
        }
        return Response.success(true);
    }

    // // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<EntityLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            EntityLogDTO dto = dtos.get(0);

            UserMst user = userRepository.findByUserCode(dto.getUserCode());
            if (user == null)
                errors.add("Invalid user code");

            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
        }
        return Response.success(true);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<EntityLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            EntityLogDTO dto = dtos.get(0);

            List<String> errors = new ArrayList<>();

            String imagePath = dto.getImagePath();

            if (imagePath != null) {
                // Validate imagePath
                String lowerPath = imagePath.toLowerCase();
                boolean isValid = lowerPath.endsWith(".png") ||
                        lowerPath.endsWith(".jpg") ||
                        lowerPath.endsWith(".jpeg") ||
                        lowerPath.endsWith(".gif");

                if (!isValid) {
                    errors.add("Invalid image path format for audit log");
                }
            }
            if (!errors.isEmpty()) {
                return Response.error(errors);
            }
        }
        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(List<EntityLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
        }
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<EntityLogDTO> dtos, String mode) {

        List<String> errors = new ArrayList<>();

        // ===== VALIDATION =====
        if (dtos == null || dtos.isEmpty()) {
            errors.add("DTO list cannot be empty");
        }

        if (!"INSERT".equalsIgnoreCase(mode) && !"UPDATE".equalsIgnoreCase(mode)) {
            errors.add("Invalid mode: " + mode);
        }

        // Stop if validation failed
        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        // ===== BUSINESS LOGIC =====
        EntityLogDTO dto = dtos.get(0);
        Long generatedAmendNo;

        if ("INSERT".equalsIgnoreCase(mode)) {

            generatedAmendNo = 1L;
        } else {

            Long MstID = dto.getMstID();

            Long latestAmendNo = entityLogRepository
                    .findLatestAmendNoByMstId(MstID)
                    .orElse(0L);

            Long authId = authorizationRepository
                    .findLatestAuthIdByMstId(MstID)
                    .orElseThrow(() -> new IllegalStateException("AuthId not found for mstId " + MstID));

            Optional<Boolean> status = authorizationRepository.findStatusByAuthId(authId);

            if (!status.orElse(false)) {
                generatedAmendNo = latestAmendNo;

            } else {
                generatedAmendNo = latestAmendNo + 1;

            }

        }

        dto.setAmendNo(String.valueOf(generatedAmendNo));
        return Response.success(dto.getAmendNo());
    }
    // =================== 6️⃣ converttoEntity ===================

    @Override
    public Response<EntityLog> converttoEntity(List<EntityLogDTO> dto) {

        // ===== CREATE COMPANY ENTITY =====
        EntityLog entity = dtoToEntity(dto);
        return Response.success(entity);
    }

    // =================== DTO → ENTITY ===================
    @Override
    protected EntityLog dtoToEntity(List<EntityLogDTO> dtos) {
        EntityLogDTO dto = dtos.get(0);

        EntityLog Log = new EntityLog();

        AddressInfoLog addressinfoLog = new AddressInfoLog();

        // Set ALL fields
        Log.setEntityLogPK(dto.getEntityLogPK());
        Log.setEtmCode(dto.getEtmCode());
        Log.setEtmName(dto.getEtmName());
        Log.setEtmShortName(dto.getEtmShortName());
        Log.setActiveDate(dto.getActiveDate());
        Log.setEtmActiveYN(dto.getEtmActiveYN());
        Log.setAmendNo(dto.getAmendNo());
        addressinfoLog.setAddress(dto.getAddress());
        addressinfoLog.setAddress1(dto.getAddress1());
        addressinfoLog.setAddress2(dto.getAddress2());
        addressinfoLog.setCountry(dto.getCountry());
        addressinfoLog.setState(dto.getState());
        addressinfoLog.setDistrict(dto.getDistrict());
        addressinfoLog.setPlace(dto.getPlace());
        addressinfoLog.setPincode(dto.getPincode());
        addressinfoLog.setLandlineNumber(dto.getLandlineNumber());
        addressinfoLog.setMobileNumber(dto.getMobileNumber());
        addressinfoLog.setEmail(dto.getEmail());
        addressinfoLog.setDesignation(dto.getDesignation());
        addressinfoLog.setEmployerName(dto.getEmployerName());
        addressinfoLog.setEmployerNumber(dto.getEmployerNumber());
        addressinfoLog.setEmployerEmail(dto.getEmployerEmail());
        addressinfoLog.setWithaffectdate(dto.getWithaffectdate());
        addressinfoLog.setImage(dto.getImagePath());
        addressinfoLog.setAmendNo(dto.getAmendNo());

        // if (dto.getAddressInfoLog() != null) {
        // entity.setAddressInfoLog(dto.getAddressInfoLog());
        // }

        return Log;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public EntityLogDTO entityToDto(EntityLog entity) {

        EntityLogDTO dto = new EntityLogDTO();

        AddressInfoLog addressinfoLog = new AddressInfoLog();

        dto.setEntityLogPK(entity.getEntityLogPK());
        dto.setEtmCode(entity.getEtmCode());
        dto.setEtmName(entity.getEtmName());
        dto.setEtmShortName(entity.getEtmShortName());
        dto.setEtmActiveYN(entity.getEtmActiveYN());
        dto.setActiveDate(entity.getActiveDate());
        // dto.setAddress(addressinfoLog.getAddress());
        // dto.setAddress1(addressinfoLog.getAddress1());
        // dto.setAddress2(addressinfoLog.getAddress2());
        // dto.setCountry(addressinfoLog.getCountry());
        // dto.setState(addressinfoLog.getState());
        // dto.setDistrict(addressinfoLog.getDistrict());
        // dto.setPlace(addressinfoLog.getPlace());
        // dto.setPincode(addressinfoLog.getPincode());
        // dto.setLandlineNumber(addressinfoLog.getLandlineNumber());
        // dto.setMobileNumber(addressinfoLog.getMobileNumber());
        // dto.setEmail(addressinfoLog.getEmail());
        // dto.setImagePath(addressinfoLog.getImage());
        // dto.setWithaffectdate(addressinfoLog.getWithaffectdate());
        // dto.setDesignation(addressinfoLog.getDesignation());
        // dto.setEmployerName(addressinfoLog.getEmployerName());
        // dto.setEmployerNumber(addressinfoLog.getEmployerNumber());
        // dto.setEmployerEmail(addressinfoLog.getEmployerEmail());
        // dto.setAmendNo(addressinfoLog.getAmendNo());
        dto.setMstID(entity.getEntityLogPK().getEtmEntityID());

        if (entity.getAuthorization() != null) {
            dto.setAuthId(entity.getAuthorization().getAuthId());
            dto.setAuthorizationStatus(entity.getAuthorization().getAuthorizationStatus());
            dto.setAuthorizationDate(entity.getAuthorization().getAuthorizationDate());

            if (entity.getAuthorization().getUserMst() != null) {
                dto.setUserCode(entity.getAuthorization().getUserMst().getUserCode());
            }
        }

        if (entity.getAddressInfoLog() != null) {
            dto.setAddress(entity.getAddressInfoLog().getAddress());
            dto.setAddress1(entity.getAddressInfoLog().getAddress1());
            dto.setAddress2(entity.getAddressInfoLog().getAddress2());
            dto.setCountry(entity.getAddressInfoLog().getCountry());
            dto.setState(entity.getAddressInfoLog().getState());
            dto.setDistrict(entity.getAddressInfoLog().getDistrict());
            dto.setPlace(entity.getAddressInfoLog().getPlace());
            dto.setPincode(entity.getAddressInfoLog().getPincode());
            dto.setLandlineNumber(entity.getAddressInfoLog().getLandlineNumber());
            dto.setMobileNumber(entity.getAddressInfoLog().getMobileNumber());
            dto.setEmail(entity.getAddressInfoLog().getEmail());
            dto.setDesignation(entity.getAddressInfoLog().getDesignation());
            dto.setEmployerName(entity.getAddressInfoLog().getEmployerName());
            dto.setEmployerNumber(entity.getAddressInfoLog().getEmployerNumber());
            dto.setEmployerEmail(entity.getAddressInfoLog().getEmployerEmail());
            dto.setImagePath(entity.getAddressInfoLog().getImage());
            // dto.setWithaffectdate(entity.getWithaffectdate().getW);
            dto.setAmendNo(entity.getAddressInfoLog().getAmendNo());

        }

        return dto;
    }

    // =================== SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected EntityLog saveEntity(EntityLog log, List<EntityLogDTO> dtos, String mode) {

        EntityLogDTO dto = dtos.get(0);

        AddressInfoLog addressinfoLog = new AddressInfoLog();

        EntityLog savedLog = null;

        if ("INSERT".equalsIgnoreCase(mode) || "UPDATE".equalsIgnoreCase(mode)) {

            log.setEntityLogPK(dto.getEntityLogPK());
            log.setEtmName(dto.getEtmName());
            log.setEtmCode(dto.getEtmCode());
            log.setEtmShortName(dto.getEtmShortName());
            log.setActiveDate(dto.getActiveDate());
            log.setEtmActiveYN(dto.getEtmActiveYN());
            log.setAmendNo(dto.getAmendNo());
            // addressinfoLog.setWithaffectdate(dto.getWithaffectdate());
            // addressinfoLog.setAddress(dto.getAddress());
            // addressinfoLog.setAddress1(dto.getAddress1());
            // addressinfoLog.setAddress2(dto.getAddress2());
            // addressinfoLog.setCountry(dto.getCountry());
            // addressinfoLog.setState(dto.getState());
            // addressinfoLog.setDistrict(dto.getDistrict());
            // addressinfoLog.setPlace(dto.getPlace());
            // addressinfoLog.setPincode(dto.getPincode());
            // addressinfoLog.setLandlineNumber(dto.getLandlineNumber());
            // addressinfoLog.setMobileNumber(dto.getMobileNumber());
            // addressinfoLog.setEmail(dto.getEmail());
            // addressinfoLog.setEmployerName(dto.getEmployerName());
            // addressinfoLog.setDesignation(dto.getDesignation());
            // addressinfoLog.setEmployerNumber(dto.getEmployerNumber());
            // addressinfoLog.setEmployerEmail(dto.getEmployerEmail());
            // addressinfoLog.setImage(dto.getImagePath());
            // // addressinfoLog.setEntityLogPK(dto.getEntityLogPK());
            // addressinfoLog.setAmendNo(dto.getAmendNo());

            // SET AUTHORIZATION
            if (dto.getAuthId() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getAuthId());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for EntityLog");
            }
            if (dto.getAddressInfoID() != null) {
                AddressInfoLog infoLog = new AddressInfoLog();
                log.setAddressInfoLog(infoLog);
            } else {
                throw new RuntimeException("AddressInfoID ID is required for EntityLog");
            }

            // SAVE TO DATABASE
            savedLog = entityLogRepository.save(log);

        }

        return savedLog;

    }

    public Response<Long> getMaxRowNo(Long companyMstID) {

        Long maxRowNo = entityLogRepository.findMaxRowNo(companyMstID);

        return Response.success(maxRowNo == null ? 0L : maxRowNo);
    }

    public List<EntityLogDTO> getLogsByCompanyMstID(Long companyMstID) {

        List<EntityLog> logs = entityLogRepository
                .findByEntityLogPK_EtmEntityIDOrderByEntityLogPK_RowNoDesc(companyMstID);

        return logs.stream()
                .map(this::entityToDto)
                .toList();
    }

}
