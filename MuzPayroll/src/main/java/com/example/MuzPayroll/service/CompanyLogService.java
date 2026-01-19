package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.CompanyLog;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.CompanyLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.AuthorizationRepository;
import com.example.MuzPayroll.repository.CompanyLogRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class CompanyLogService extends MuzirisAbstractService<CompanyLogDTO, CompanyLog> {

    @Autowired
    private CompanyLogRepository companyLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<CompanyLogDTO> dtos, String mode) {

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
    public Response<Boolean> entityPopulate(List<CompanyLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            List<String> errors = new ArrayList<>();
            CompanyLogDTO dto = dtos.get(0);

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
    public Response<Boolean> businessValidate(List<CompanyLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {

            CompanyLogDTO dto = dtos.get(0);

            List<String> errors = new ArrayList<>();

            String imagePath = dto.getCompanyImagePath();

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
    public Response<Object> generatePK(List<CompanyLogDTO> dtos, String mode) {

        if ("INSERT".equals(mode) || "UPDATE".equals(mode)) {
        }
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<CompanyLogDTO> dtos, String mode) {

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
        CompanyLogDTO dto = dtos.get(0);
        Long generatedAmendNo;

        if ("INSERT".equalsIgnoreCase(mode)) {

            generatedAmendNo = 1L;
        } else {

            Long MstID = dto.getCompanyMstID();

            Long latestAmendNo = companyLogRepository
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
    public Response<CompanyLog> converttoEntity(List<CompanyLogDTO> dto) {

        // ===== CREATE COMPANY ENTITY =====
        CompanyLog company = dtoToEntity(dto);
        return Response.success(company);
    }

    // =================== DTO → ENTITY ===================
    @Override
    protected CompanyLog dtoToEntity(List<CompanyLogDTO> dtos) {
        CompanyLogDTO dto = dtos.get(0);

        CompanyLog companyLog = new CompanyLog();

        // Set ALL fields
        companyLog.setCode(dto.getCode());
        companyLog.setCompany(dto.getCompany());
        companyLog.setShortName(dto.getShortName());
        companyLog.setActiveDate(dto.getActiveDate());
        companyLog.setAddress(dto.getAddress());
        companyLog.setAddress1(dto.getAddress1());
        companyLog.setAddress2(dto.getAddress2());
        companyLog.setCountry(dto.getCountry());
        companyLog.setState(dto.getState());
        companyLog.setDistrict(dto.getDistrict());
        companyLog.setPlace(dto.getPlace());
        companyLog.setPincode(dto.getPincode());
        companyLog.setLandlineNumber(dto.getLandlineNumber());
        companyLog.setMobileNumber(dto.getMobileNumber());
        companyLog.setEmail(dto.getEmail());
        companyLog.setDesignation(dto.getDesignation());
        companyLog.setEmployerName(dto.getEmployerName());
        companyLog.setEmployerNumber(dto.getEmployerNumber());
        companyLog.setEmployerEmail(dto.getEmployerEmail());
        companyLog.setWithaffectdate(dto.getWithaffectdate());
        companyLog.setCompanyImage(dto.getCompanyImagePath());
        companyLog.setCompanyLogPK(dto.getCompanyLogPK());
        companyLog.setAmendNo(dto.getAmendNo());

        return companyLog;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public CompanyLogDTO entityToDto(CompanyLog entity) {

        CompanyLogDTO dto = new CompanyLogDTO();

        dto.setCode(entity.getCode());
        dto.setCompany(entity.getCompany());
        dto.setShortName(entity.getShortName());
        dto.setActiveDate(entity.getActiveDate());
        dto.setAddress(entity.getAddress());
        dto.setAddress1(entity.getAddress1());
        dto.setAddress2(entity.getAddress2());
        dto.setCountry(entity.getCountry());
        dto.setState(entity.getState());
        dto.setDistrict(entity.getDistrict());
        dto.setPlace(entity.getPlace());
        dto.setPincode(entity.getPincode());
        dto.setLandlineNumber(entity.getLandlineNumber());
        dto.setMobileNumber(entity.getMobileNumber());
        dto.setEmail(entity.getEmail());
        dto.setCompanyImagePath(entity.getCompanyImage());
        dto.setWithaffectdate(entity.getWithaffectdate());
        dto.setDesignation(entity.getDesignation());
        dto.setEmployerName(entity.getEmployerName());
        dto.setEmployerNumber(entity.getEmployerNumber());
        dto.setEmployerEmail(entity.getEmployerEmail());
        dto.setAmendNo(entity.getAmendNo());
        dto.setCompanyLogPK(entity.getCompanyLogPK());
        dto.setCompanyMstID(entity.getCompanyLogPK().getCompanyMstID());

        if (entity.getAuthorization() != null) {
            dto.setAuthId(entity.getAuthorization().getAuthId());
            dto.setAuthorizationStatus(entity.getAuthorization().getAuthorizationStatus());
            dto.setAuthorizationDate(entity.getAuthorization().getAuthorizationDate());

            if (entity.getAuthorization().getUserMst() != null) {
                dto.setUserCode(entity.getAuthorization().getUserMst().getUserCode());
            }
        }

        return dto;
    }

    // =================== SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected CompanyLog saveEntity(CompanyLog log, List<CompanyLogDTO> dtos, String mode) {

        CompanyLogDTO dto = dtos.get(0);
        CompanyLog savedLog = null;

        if ("INSERT".equalsIgnoreCase(mode) || "UPDATE".equalsIgnoreCase(mode)) {

            log.setCompany(dto.getCompany());
            log.setCode(dto.getCode());
            log.setShortName(dto.getShortName());
            log.setActiveDate(dto.getActiveDate());
            log.setWithaffectdate(dto.getWithaffectdate());
            log.setAddress(dto.getAddress());
            log.setAddress1(dto.getAddress1());
            log.setAddress2(dto.getAddress2());
            log.setCountry(dto.getCountry());
            log.setState(dto.getState());
            log.setDistrict(dto.getDistrict());
            log.setPlace(dto.getPlace());
            log.setPincode(dto.getPincode());
            log.setLandlineNumber(dto.getLandlineNumber());
            log.setMobileNumber(dto.getMobileNumber());
            log.setEmail(dto.getEmail());
            log.setEmployerName(dto.getEmployerName());
            log.setDesignation(dto.getDesignation());
            log.setEmployerNumber(dto.getEmployerNumber());
            log.setEmployerEmail(dto.getEmployerEmail());
            log.setCompanyImage(dto.getCompanyImagePath());
            log.setCompanyLogPK(dto.getCompanyLogPK());
            log.setAmendNo(dto.getAmendNo());

            // SET AUTHORIZATION
            if (dto.getAuthId() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getAuthId());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for CompanyLog");
            }

            // SAVE TO DATABASE
            savedLog = companyLogRepository.save(log);

        }

        return savedLog;

    }

    public Response<Long> getMaxRowNo(Long companyMstID) {

        Long maxRowNo = companyLogRepository.findMaxRowNo(companyMstID);

        return Response.success(maxRowNo == null ? 0L : maxRowNo);
    }

    public List<CompanyLogDTO> getLogsByCompanyMstID(Long companyMstID) {

        List<CompanyLog> logs = companyLogRepository
                .findByCompanyLogPK_CompanyMstIDOrderByCompanyLogPK_RowNoDesc(companyMstID);

        return logs.stream()
                .map(this::entityToDto)
                .toList();
    }

}
