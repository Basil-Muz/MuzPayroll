// package com.example.MuzPayroll.service;

// import java.util.ArrayList;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.example.MuzPayroll.entity.Authorization;
// import com.example.MuzPayroll.entity.LocationLog;
// import com.example.MuzPayroll.entity.UserMst;
// import com.example.MuzPayroll.entity.DTO.LocationLogDTO;
// import com.example.MuzPayroll.entity.DTO.Response;
// import com.example.MuzPayroll.repository.LocationLogRepository;
// import com.example.MuzPayroll.repository.UserRepository;

// @Service
// public class LocationLogService extends MuzirisAbstractService<LocationLogDTO, LocationLog> {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private LocationLogRepository locationLogRepository;

//     // =================== 1️⃣ ENTITY VALIDATION ===================
//     @Override
//     public Response<Boolean> entityValidate(List<LocationLogDTO> dtos) {
//         if (dtos == null)
//             return Response.error("DTO cannot be null");
//         List<String> errors = new ArrayList<>();

//         if (!errors.isEmpty()) {
//             return Response.error(errors);
//         }

//         return Response.success(true);
//     }

//     // // =================== 2️⃣ ENTITY POPULATE ===================
//     @Override
//     public Response<Boolean> entityPopulate(List<LocationLogDTO> dtos) {
//         List<String> errors = new ArrayList<>();
//         LocationLogDTO dto = dtos.get(0);

//         UserMst user = userRepository.findByUserCode(dto.getUserCode());
//         if (user == null)
//             errors.add("Invalid user code");

//         if (!errors.isEmpty()) {
//             return Response.error(errors);
//         }
//         return Response.success(true);
//     }

//     // =================== 3️⃣ BUSINESS VALIDATION ===================
//     @Override
//     public Response<Boolean> businessValidate(List<LocationLogDTO> dtos) {
//         List<String> errors = new ArrayList<>();

//         if (!errors.isEmpty()) {
//             return Response.error(errors);
//         }
//         return Response.success(true);
//     }

//     // =================== 4️⃣ GENERATE PK ===================
//     @Override
//     public Response<Object> generatePK(List<LocationLogDTO> dtos) {
//         return Response.success(true);
//     }

//     // =================== 5️⃣ GENERATE SERIAL NO ===================
//     @Override
//     public Response<String> generateSerialNo(List<LocationLogDTO> dto) {

//         return Response.success("Operation successful");
//     }

//     // =================== 6️⃣ converttoEntity ===================

//     @Override
//     public Response<LocationLog> converttoEntity(List<LocationLogDTO> dto) {

//         // ===== CREATE ENTITY =====
//         LocationLog entity = dtoToEntity(dto);
//         return Response.success(entity);
//     }

//     // =================== DTO → ENTITY ===================
//     @Override
//     protected LocationLog dtoToEntity(List<LocationLogDTO> dtos) {
//         LocationLogDTO dto = dtos.get(0);

//         LocationLog log = new LocationLog();

//         // Set ALL fields

//         log.setLocation(dto.getLocation());
//         log.setBranchEntity(dto.getBranchEntity());
//         log.setCode(dto.getCode());
//         log.setCompanyEntity(dto.getCompanyEntity());
//         log.setShortName(dto.getShortName());
//         log.setActiveDate(dto.getActiveDate());
//         log.setAddress(dto.getAddress());
//         log.setAddress1(dto.getAddress1());
//         log.setAddress2(dto.getAddress2());
//         log.setCountry(dto.getCountry());
//         log.setState(dto.getState());
//         log.setDistrict(dto.getDistrict());
//         log.setPlace(dto.getPlace());
//         log.setPincode(dto.getPincode());
//         log.setLandlineNumber(dto.getLandlineNumber());
//         log.setMobileNumber(dto.getMobileNumber());
//         log.setEmail(dto.getEmail());
//         log.setWithaffectdate(dto.getWithaffectdate());
//         log.setDesignation(dto.getDesignation());
//         log.setEmployerName(dto.getEmployerName());
//         log.setEmployerNumber(dto.getEmployerNumber());
//         log.setEmployerEmail(dto.getEmployerEmail());
//         log.setEsiRegion(dto.getEsiRegion());
//         log.setLocationLogPK(dto.getLocatioinLogPK());

//         return log;
//     }

//     // =================== ENTITY → DTO ===================
//     @Override
//     public LocationLogDTO entityToDto(LocationLog entity) {

//         LocationLogDTO dto = new LocationLogDTO();

//         dto.setBranchEntity(entity.getBranchEntity());
//         dto.setCode(entity.getCode());
//         dto.setCompanyEntity(entity.getCompanyEntity());
//         dto.setShortName(entity.getShortName());
//         dto.setActiveDate(entity.getActiveDate());
//         dto.setAddress(entity.getAddress());
//         dto.setAddress1(entity.getAddress1());
//         dto.setAddress2(entity.getAddress2());
//         dto.setCountry(entity.getCountry());
//         dto.setState(entity.getState());
//         dto.setDistrict(entity.getDistrict());
//         dto.setPlace(entity.getPlace());
//         dto.setPincode(entity.getPincode());
//         dto.setLandlineNumber(entity.getLandlineNumber());
//         dto.setMobileNumber(entity.getMobileNumber());
//         dto.setEmail(entity.getEmail());
//         dto.setWithaffectdate(entity.getWithaffectdate());
//         dto.setDesignation(entity.getDesignation());
//         dto.setEmployerName(entity.getEmployerName());
//         dto.setEmployerNumber(entity.getEmployerNumber());
//         dto.setEmployerEmail(entity.getEmployerEmail());
//         dto.setEsiRegion(entity.getEsiRegion());
//         dto.setLocatioinLogPK(entity.getLocationLogPK());

//         return dto;
//     }

//     // =================== SAVE ENTITY IN SERVICE ===================
//     @Override
//     @Transactional(rollbackFor = Exception.class)
//     protected LocationLog saveEntity(LocationLog log, List<LocationLogDTO> dtos) {
//         LocationLogDTO dto = dtos.get(0);
//         try {
//             log.setLocation(dto.getLocation());
//             log.setBranchEntity(dto.getBranchEntity());
//             log.setCompanyEntity(dto.getCompanyEntity());
//             log.setCode(dto.getCode());
//             log.setShortName(dto.getShortName());
//             log.setActiveDate(dto.getActiveDate());
//             log.setWithaffectdate(dto.getWithaffectdate());
//             log.setAddress(dto.getAddress());
//             log.setAddress1(dto.getAddress1());
//             log.setAddress2(dto.getAddress2());
//             log.setCountry(dto.getCountry());
//             log.setState(dto.getState());
//             log.setDistrict(dto.getDistrict());
//             log.setPlace(dto.getPlace());
//             log.setPincode(dto.getPincode());
//             log.setLandlineNumber(dto.getLandlineNumber());
//             log.setMobileNumber(dto.getMobileNumber());
//             log.setEmail(dto.getEmail());
//             log.setEmployerName(dto.getEmployerName());
//             log.setDesignation(dto.getDesignation());
//             log.setEmployerNumber(dto.getEmployerNumber());
//             log.setEmployerEmail(dto.getEmployerEmail());
//             log.setLocationLogPK(dto.getLocatioinLogPK());
//             log.setEsiRegion(dto.getEsiRegion());

//             // SET AUTHORIZATION
//             if (dto.getAuthId() != null) {
//                 Authorization auth = new Authorization();
//                 auth.setAuthId(dto.getAuthId());
//                 log.setAuthorization(auth);
//             } else {
//                 throw new RuntimeException("Authorization ID is required for CompanyLog");
//             }

//             // SAVE TO DATABASE
//             LocationLog savedLog = locationLogRepository.save(log);

//             return savedLog;

//         } catch (Exception e) {
//             e.printStackTrace();
//             throw new RuntimeException("Error saving Location log: " + e.getMessage(), e);
//         }
//     }

//     public Response<Long> getMaxRowNo(Long locationMstID) {

//         Long maxRowNo = locationLogRepository.findMaxRowNo(locationMstID);

//         return Response.success(maxRowNo == null ? 0L : maxRowNo);
//     }

// }
