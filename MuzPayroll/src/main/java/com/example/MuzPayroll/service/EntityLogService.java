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
import com.example.MuzPayroll.entity.DTO.EntityDataDTO;
import com.example.MuzPayroll.entity.DTO.EntityLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.AddressInfoLogRepository;
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

    @Autowired
    private AddressInfoLogRepository addressInfoLogRepository;

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

            // ===== CREATE AUTHORIZATION =====
            AddressInfoLog infoLog = new AddressInfoLog();
            infoLog.setAddress(dto.getAddress());
            infoLog.setAddress(dto.getAddress());
            infoLog.setAddress1(dto.getAddress1());
            infoLog.setAddress2(dto.getAddress2());
            infoLog.setCountry(dto.getCountry());
            infoLog.setState(dto.getState());
            infoLog.setDistrict(dto.getDistrict());
            infoLog.setPlace(dto.getPlace());
            infoLog.setPincode(dto.getPincode());
            infoLog.setLandlineNumber(dto.getLandlineNumber());
            infoLog.setMobileNumber(dto.getMobileNumber());
            infoLog.setEmail(dto.getEmail());
            infoLog.setDesignation(dto.getDesignation());
            infoLog.setEmployerName(dto.getEmployerName());
            infoLog.setEmployerNumber(dto.getEmployerNumber());
            infoLog.setEmployerEmail(dto.getEmployerEmail());
            infoLog.setWithaffectdate(dto.getWithaffectdate());
            infoLog.setAmendNo(dto.getAmendNo());

            dto.setAddressInfoLog(infoLog);

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

            // populateAddressPKfromEntity(transID, logRowNo, dto);/

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

            Long MstID = dto.getEtmEntityId();

            Long latestAmendNo = entityLogRepository
                    .findLatestAmendNoByMstId(MstID)
                    .orElse(0L);

            Long authId = authorizationRepository
                    .findLatestAuthIdByMstId(MstID)
                    .orElseThrow(() -> new IllegalStateException("AuthId not found for Entity ID " + MstID));

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

        // Set ALL fields
        Log.setEntityLogPK(dto.getEntityLogPK());
        Log.setEtmCode(dto.getEtmCode());
        Log.setEtmName(dto.getEtmName());
        Log.setEtmShortName(dto.getEtmShortName());
        Log.setActiveDate(dto.getActiveDate());
        Log.setEtmActiveYN(dto.getEtmActiveYN());
        Log.setAmendNo(dto.getAmendNo());
        Log.setAuthorization(dto.getAuthorization());
        Log.setAddressInfoLog(dto.getAddressInfoLogID());
        // Log.setAddressInfoLog(dto.getLogRowNo());

        AddressInfoLog addressinfoLog = new AddressInfoLog();

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
        addressinfoLog.setAmendNo(dto.getAmendNo());
        addressinfoLog.setAddressInfoLogPK(dto.getAddressInfoLogPK());

        if (dto.getAddressInfoLog() != null) {
            Log.setAddressInfoLog(dto.getAddressInfoLog());
        }

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
        dto.setImagePath(entity.getEtmImage());
        dto.setInactiveDate(entity.getInactiveDate());
        dto.setAmendNo(entity.getAmendNo());
        dto.setEtmEntityId(entity.getEntityLogPK().getEtmEntityID());
        dto.setAddressInfoID(entity.getAddressInfoLogPK().getAddressInfoID());
        dto.setMuzControlCodes(entity.getMuzControlCodes());

        if (entity.getAuthorization() != null) {
            dto.setAuthId(entity.getAuthorization().getAuthId());
            dto.setAuthorizationStatus(entity.getAuthorization().getAuthorizationStatus());
            dto.setAuthorizationDate(entity.getAuthorization().getAuthorizationDate());

            if (entity.getAuthorization().getUserMst() != null) {
                dto.setUserCode(entity.getAuthorization().getUserMst().getUserCode());
            }
        }

        if (entity.getAddressInfoLog() != null) {

            dto.setAddressInfoLogPK(entity.getAddressInfoLog().getAddressInfoLogPK());
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
            dto.setWithaffectdate(entity.getAddressInfoLog().getWithaffectdate());

        }

        return dto;
    }

    // =================== SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected EntityLog saveEntity(EntityLog log, List<EntityLogDTO> dtos, String mode) {

        EntityLogDTO dto = dtos.get(0);

        EntityLog savedLog = null;

        if ("INSERT".equalsIgnoreCase(mode) || "UPDATE".equalsIgnoreCase(mode)) {

            // ===== SAVE Address info =====
            AddressInfoLog addressinfoLog = new AddressInfoLog();

            // SET THE PK ON THE ADDRESSINFOLOG
            addressinfoLog.setAddressInfoLogPK(dto.getAddressInfoLogPK());
            addressinfoLog.setWithaffectdate(dto.getWithaffectdate());
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
            addressinfoLog.setEmployerName(dto.getEmployerName());
            addressinfoLog.setDesignation(dto.getDesignation());
            addressinfoLog.setEmployerNumber(dto.getEmployerNumber());
            addressinfoLog.setEmployerEmail(dto.getEmployerEmail());
            addressinfoLog.setAmendNo(dto.getAmendNo());

            AddressInfoLog savedAddress = addressInfoLogRepository.save(addressinfoLog);

            // MANUALLY SET THE FK FIELDS
            if (savedAddress != null && savedAddress.getAddressInfoLogPK() != null) {
                // You need to have these setter methods in your EntityLog class
                log.setAddressInfoID(savedAddress.getAddressInfoLogPK().getAddressInfoID());
                log.setRowNo(savedAddress.getAddressInfoLogPK().getRowNo());
            }
            log.setEntityLogPK(dto.getEntityLogPK());
            log.setEtmName(dto.getEtmName());
            log.setEtmCode(dto.getEtmCode());
            log.setEtmShortName(dto.getEtmShortName());
            log.setActiveDate(dto.getActiveDate());
            log.setEtmActiveYN(dto.getEtmActiveYN());
            log.setAmendNo(dto.getAmendNo());
            log.setEtmDocInfoID(dto.getEtmDocInfoID());
            log.setEtmImage(dto.getImagePath());
            log.setEtmIntPrefix(dto.getEtmIntPrefix());
            log.setEtmPrefix(dto.getEtmPrefix());
            log.setInactiveDate(dto.getInactiveDate());
            log.setMuzControlCodes(dto.getMuzControlCodes());

            // SET AUTHORIZATION
            if (dto.getAuthId() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getAuthId());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for EntityLog");
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
                .findAllEntityLogs(companyMstID);

        return logs.stream()
                .map(this::entityToDto)
                .toList();
    }

}
