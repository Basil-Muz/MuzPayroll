package com.example.MuzPayroll.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.BranchLog;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.DTO.BranchLogDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.BranchLogRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class BranchLogService extends MuzirisAbstractService<BranchLogDTO, BranchLog> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchLogRepository branchLogRepository;

    // =================== 1️⃣ ENTITY VALIDATION ===================
    @Override
    public Response<Boolean> entityValidate(List<BranchLogDTO> dtos) {
        if (dtos == null)
            return Response.error("DTO cannot be null");
        List<String> errors = new ArrayList<>();

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }

        return Response.success(true);
    }

    // // =================== 2️⃣ ENTITY POPULATE ===================
    @Override
    public Response<Boolean> entityPopulate(List<BranchLogDTO> dtos) {
        List<String> errors = new ArrayList<>();
        BranchLogDTO dto = dtos.get(0);

        UserMst user = userRepository.findByUserCode(dto.getUserCode());
        if (user == null)
            errors.add("Invalid user code");

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        return Response.success(true);
    }

    // =================== 3️⃣ BUSINESS VALIDATION ===================
    @Override
    public Response<Boolean> businessValidate(List<BranchLogDTO> dtos) {
        List<String> errors = new ArrayList<>();

        if (!errors.isEmpty()) {
            return Response.error(errors);
        }
        return Response.success(true);
    }

    // =================== 4️⃣ GENERATE PK ===================
    @Override
    public Response<Object> generatePK(List<BranchLogDTO> dtos) {
        return Response.success(true);
    }

    // =================== 5️⃣ GENERATE SERIAL NO ===================
    @Override
    public Response<String> generateSerialNo(List<BranchLogDTO> dto) {

        return Response.success("Operation successful");
    }

    // =================== 6️⃣ converttoEntity ===================

    @Override
    public Response<BranchLog> converttoEntity(List<BranchLogDTO> dto) {

        // ===== CREATE ENTITY =====
        BranchLog entity = dtoToEntity(dto);
        return Response.success(entity);
    }

    // =================== DTO → ENTITY ===================
    @Override
    protected BranchLog dtoToEntity(List<BranchLogDTO> dtos) {
        BranchLogDTO dto = dtos.get(0);

        BranchLog log = new BranchLog();

        // Set ALL fields
        log.setBranch(dto.getBranch());
        log.setCode(dto.getCode());
        log.setCompanyEntity(dto.getCompanyEntity());
        log.setShortName(dto.getShortName());
        log.setActiveDate(dto.getActiveDate());
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
        log.setWithaffectdate(dto.getWithaffectdate());
        log.setBranchLogPK(dto.getBranchLogPK());
        return log;
    }

    // =================== ENTITY → DTO ===================
    @Override
    public BranchLogDTO entityToDto(BranchLog entity) {

        BranchLogDTO dto = new BranchLogDTO();

        dto.setBranch(entity.getCode());
        dto.setCode(entity.getCode());
        dto.setCompanyEntity(entity.getCompanyEntity());
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
        dto.setWithaffectdate(entity.getWithaffectdate());
        return dto;
    }

    // =================== SAVE ENTITY IN SERVICE ===================
    @Override
    @Transactional(rollbackFor = Exception.class)
    protected BranchLog saveEntity(BranchLog log, List<BranchLogDTO> dtos) {
        BranchLogDTO dto = dtos.get(0);
        try {
            log.setBranch(dto.getBranch());
            log.setCompanyEntity(dto.getCompanyEntity());
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
            log.setBranchLogPK(dto.getBranchLogPK());

            // SET AUTHORIZATION
            if (dto.getAuthId() != null) {
                Authorization auth = new Authorization();
                auth.setAuthId(dto.getAuthId());
                log.setAuthorization(auth);
            } else {
                throw new RuntimeException("Authorization ID is required for CompanyLog");
            }

            // SAVE TO DATABASE
            BranchLog savedLog = branchLogRepository.save(log);

            return savedLog;

        } catch (Exception e) {
            System.err.println("Error saving company log: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error saving company log: " + e.getMessage(), e);
        }
    }

    public Response<Long> getMaxRowNo(Long companyMstID) {
        System.out.println("companyMstID" + companyMstID);

        Long maxRowNo = branchLogRepository.findMaxRowNo(companyMstID);

        System.out.println("maxRowNo" + maxRowNo);

        return Response.success(maxRowNo == null ? 0L : maxRowNo);
    }

}
