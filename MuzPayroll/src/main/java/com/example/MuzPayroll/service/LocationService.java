// package com.example.MuzPayroll.service;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.example.MuzPayroll.entity.Authorization;
// import com.example.MuzPayroll.entity.BranchMst;
// import com.example.MuzPayroll.entity.CompanyMst;
// import com.example.MuzPayroll.entity.LocationLog;
// import com.example.MuzPayroll.entity.LocationLogPK;
// import com.example.MuzPayroll.entity.LocationMst;
// import com.example.MuzPayroll.entity.UserMst;
// import com.example.MuzPayroll.entity.DTO.LocationDTO;
// import com.example.MuzPayroll.entity.DTO.LocationLogDTO;
// import com.example.MuzPayroll.entity.DTO.Response;
// import com.example.MuzPayroll.repository.AuthorizationRepository;

// import com.example.MuzPayroll.repository.LocationLogRepository;
// import com.example.MuzPayroll.repository.LocationRepository;
// import com.example.MuzPayroll.repository.UserRepository;

// import com.fasterxml.jackson.databind.ObjectMapper;

// @Service
// public class LocationService extends MuzirisAbstractService<LocationDTO, LocationMst> {

//     @Autowired
//     private LocationRepository locationRepository;

//     @Autowired
//     private LocationLogService locationLogService;

//     @Autowired
//     private AuthorizationRepository authorizationRepository;

//     @Autowired
//     private UserRepository userRepository;

//     // ================= FINAL SAVE WRAPPER =================
//     @Transactional
//     public Response<LocationDTO> saveWrapper(LocationDTO dto) {
//         List<LocationDTO> dtos = new ArrayList<>();
//         dtos.add(dto);
//         return save(dtos);
//     }

//     // =================== 1️⃣ ENTITY VALIDATION ===================
//     @Override
//     public Response<Boolean> entityValidate(List<LocationDTO> dtos) {

//         if (dtos == null || dtos.isEmpty()) {
//             return Response.error("DTO cannot be null or empty");
//         }

//         List<String> errors = new ArrayList<>();
//         boolean hasAnyError = false;

//         for (int rowIndex = 0; rowIndex < dtos.size(); rowIndex++) {
//             LocationDTO dto = dtos.get(rowIndex);
//             int rowNumber = rowIndex + 1;

//             List<String> rowErrors = new ArrayList<>();

//             // Check if this row (DTO) is null
//             if (dto == null) {
//                 errors.add("Row " + rowNumber + ": DTO object is null");
//                 hasAnyError = true;
//                 continue; // Skip to next row
//             }

//             // Collect ALL errors
//             if (isEmpty(dto.getLocation()))
//                 rowErrors.add("Location is required");
//             if (isEmpty(dto.getBranchEntity()))
//                 rowErrors.add("Branch is required");
//             if (isEmpty(dto.getCompanyEntity()))
//                 rowErrors.add("Company is required");
//             if (isEmpty(dto.getShortName()))
//                 rowErrors.add("Short name is required");
//             if (dto.getActiveDate() == null)
//                 rowErrors.add("Active date is required");
//             if (isEmpty(dto.getAddress()))
//                 rowErrors.add("Address is required");
//             if (isEmpty(dto.getCountry()))
//                 rowErrors.add("Country is required");
//             if (isEmpty(dto.getState()))
//                 rowErrors.add("State is required");
//             if (isEmpty(dto.getDistrict()))
//                 rowErrors.add("District is required");
//             if (isEmpty(dto.getPlace()))
//                 rowErrors.add("Place is required");
//             if (isEmpty(dto.getPincode()))
//                 rowErrors.add("Pincode is required");
//             if (isEmpty(dto.getMobileNumber()))
//                 rowErrors.add("Mobile number is required");
//             if (isEmpty(dto.getEmail()))
//                 rowErrors.add("Email is required");
//             if (dto.getWithaffectdate() == null)
//                 rowErrors.add("With affect date is required");
//             if (dto.getAuthorizationDate() == null)
//                 rowErrors.add("Authorization date is required");
//             if (dto.getAuthorizationStatus() == null)
//                 rowErrors.add("Authorization status is required");
//             if (isEmpty(dto.getUserCode()))
//                 rowErrors.add("User code is required");

//             // Add row errors to main error list with row number
//             if (!rowErrors.isEmpty()) {
//                 hasAnyError = true;

//                 // Create a prefix for this row's errors
//                 String rowPrefix = "Row " + rowNumber;
//                 if (!isEmpty(dto.getLocation())) {
//                     rowPrefix += " (Location: " + dto.getLocation() + ")";
//                 }

//                 for (String error : rowErrors) {
//                     errors.add(rowPrefix + ": " + error);
//                 }
//             }
//             // Return result
//             if (hasAnyError) {
//                 return Response.error(errors);
//             }
//         }

//         // if log table present ---->
//         List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//         Response<Boolean> logEntityValidate = locationLogService.entityValidate(logDtos);

//         // If log validation fails, return those errors
//         if (!logEntityValidate.isSuccess()) {
//             return logEntityValidate;
//         }
//         // <-----

//         return Response.success(true);
//     }

//     // =================== 2️⃣ ENTITY POPULATE ===================
//     @Override
//     public Response<Boolean> entityPopulate(List<LocationDTO> dtos) {
//         List<String> errors = new ArrayList<>();
//         LocationDTO dto = dtos.get(0);

//         UserMst user = userRepository.findByUserCode(dto.getUserCode());
//         if (user == null)
//             errors.add("Invalid user code");

//         if (!errors.isEmpty()) {
//             return Response.error(errors);
//         }

//         // ===== CREATE AUTHORIZATION =====
//         Authorization auth = new Authorization();
//         auth.setAuthorizationDate(dto.getAuthorizationDate());
//         auth.setAuthorizationStatus(dto.getAuthorizationStatus());
//         auth.setUserMst(user);

//         // Store authorization temporarily
//         dto.setAuthorization(auth);

//         // if log table present ---->
//         // ******* Populate Log Entity *********************
//         List<LocationLogDTO> LocationDtoLogs = populateLogEntityfromEntity(dto);
//         dto.setLocationDtoLogs(LocationDtoLogs);

//         // CALL LogService entityValidate
//         List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//         Response<Boolean> logEntityPopulate = locationLogService.entityPopulate(logDtos);

//         // If log entityPopulate fails, return errors
//         if (!logEntityPopulate.isSuccess()) {
//             return Response.error(logEntityPopulate.getErrors());
//         }
//         // <-----

//         return Response.success(true);
//     }

//     // =================== 3️⃣ BUSINESS VALIDATION ===================
//     @Override
//     public Response<Boolean> businessValidate(List<LocationDTO> dtos) {

//         List<String> errors = new ArrayList<>();
//         if (!errors.isEmpty()) {
//             return Response.error(errors);
//         }

//         // if log table present ---->

//         List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//         Response<Boolean> logbusinessValidate = locationLogService.businessValidate(logDtos);

//         // If log businessValidate fails, return errors
//         if (!logbusinessValidate.isSuccess()) {
//             return Response.error(logbusinessValidate.getErrors());
//         }

//         // <-----

//         return Response.success(true);
//     }

//     // =================== 4️⃣ GENERATE PK ===================
//     @Override
//     public Response<Object> generatePK(List<LocationDTO> dtos) {
//         List<String> errors = new ArrayList<>();

//         if (dtos == null || dtos.isEmpty()) {
//             return Response.error("No location data provided");
//         }

//         try {
//             // Process each DTO in the list
//             for (LocationDTO dto : dtos) {
//                 if (dto == null) {
//                     errors.add("Null DTO found in list");
//                     continue;
//                 }

//                 Long transID = dto.getLocationMstID();
//                 Long generatedId = null;

//                 // ID IS PROVIDED IN DTO
//                 if (transID != null) {
//                     // Check if this ID exists in database
//                     boolean existsInDB = locationRepository.existsById(transID);

//                     if (existsInDB) {
//                         // ID is present in DB
//                         generatedId = transID;
//                     } else {
//                         // ID provided but NOT in DB - RETURN ERROR
//                         errors.add("Location ID " + transID + " does not exist in database");
//                         continue;
//                     }

//                 }
//                 // ID IS NOT PROVIDED IN DTO (null)
//                 else {
//                     // Find maximum ID from database
//                     Long maxId = locationRepository.findMaxLocationMstID();

//                     if (maxId == null) {
//                         // No data in DB - start from 100000
//                         generatedId = 300000L;
//                     } else {
//                         // Data exists - get latest data and increment
//                         generatedId = maxId + 1;

//                         if (generatedId > 399999L) {
//                             errors.add("Cannot generate ID. Maximum limit (399999) reached for Location: " +
//                                     (dto.getLocation() != null ? dto.getLocation() : "Unknown"));
//                             continue;
//                         }
//                     }

//                     dto.setLocationMstID(generatedId);
//                 }

//                 // Process log rows for this DTO
//                 if (generatedId != null) {
//                     transID = generatedId;
//                     Long logRowNo = 1L; // Default to 1

//                     // Get max row number for this transaction
//                     Response<Long> responseLogMaxRowNo = locationLogService.getMaxRowNo(transID);

//                     if (responseLogMaxRowNo.isSuccess() && responseLogMaxRowNo.getData() != null) {
//                         logRowNo = responseLogMaxRowNo.getData() + 1;
//                     }

//                     // Populate log entity PK
//                     populateLogEntityPKfromEntity(transID, logRowNo, dto);
//                 }
//             }

//             // If any errors occurred, return them
//             if (!errors.isEmpty()) {
//                 return Response.error(errors);
//             }

//             // Process all log DTOs together
//             List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//             Response<Object> logGeneratePK = locationLogService.generatePK(logDtos);

//             if (!logGeneratePK.isSuccess()) {
//                 return logGeneratePK;
//             }

//             return Response.success(true);

//         } catch (Exception e) {
//             e.printStackTrace();
//             return Response.error("Error generating PK: " + e.getMessage());
//         }
//     }

//     // =================== 5️⃣ GENERATE SERIAL NO ===================
//     @Override
//     public Response<String> generateSerialNo(List<LocationDTO> dtos) {

//         List<String> errors = new ArrayList<>();
//         LocationDTO dto = dtos.get(0);

//         try {

//             String prefix = "LO";

//             // Generate new code
//             Pageable pageable = PageRequest.of(0, 1);
//             List<LocationMst> ResponseData = locationRepository.findLatestLocationWithLOPrefix(pageable);

//             String generatedCode;

//             if (ResponseData == null || ResponseData.isEmpty()) {
//                 generatedCode = prefix + "01";
//             } else {
//                 LocationMst latestResponse = ResponseData.get(0);
//                 String latestCode = latestResponse.getCode();

//                 // Extract and increment
//                 String numberPart = latestCode.substring(prefix.length());
//                 String digits = numberPart.replaceAll("[^0-9]", "");
//                 int latestNumber = Integer.parseInt(digits);
//                 int nextNumber = latestNumber + 1;

//                 // Check limit
//                 if (nextNumber > 99) {
//                     errors.add("Location code limit reached (max: BR99)");
//                 }

//                 generatedCode = prefix + String.format("%02d", nextNumber);
//             }

//             // SET CODE IN BOTH DTO AND ENTITY
//             dto.setCode(generatedCode);

//             // if log table present ---->

//             List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//             Response<String> loggenerateSerialNo = locationLogService.generateSerialNo(logDtos);

//             if (!loggenerateSerialNo.isSuccess()) {
//                 // Return log service's error
//                 return loggenerateSerialNo;
//             }
//             // <-----

//             if (!errors.isEmpty()) {
//                 return Response.error(errors);
//             }
//             return Response.success(generatedCode);

//         } catch (Exception e) {
//             e.printStackTrace();
//             // Last resort fallback
//             String fallbackCode = "BR01";
//             dto.setCode(fallbackCode);
//             return Response.success(fallbackCode);
//         }
//     }

//     // =================== 6️⃣ converttoEntity ===================
//     @Override
//     public Response<LocationMst> converttoEntity(List<LocationDTO> dtos) {

//         // ===== CREATE ENTITY =====
//         LocationMst entity = dtoToEntity(dtos);

//         // if log table present ---->
//         List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//         Response<LocationLog> logconverttoEntity = locationLogService.converttoEntity(logDtos);

//         if (!logconverttoEntity.isSuccess()) {
//             return Response.error("Location Log Dto is not converted");
//         }
//         // <-----

//         return Response.success(entity);

//     }

//     // =================== DTO → ENTITY ===================
//     @Override
//     protected LocationMst dtoToEntity(List<LocationDTO> dtos) {
//         if (dtos == null || dtos.isEmpty()) {
//             return null;
//         }

//         // Take the first DTO from the list
//         LocationDTO dto = dtos.get(0);

//         LocationMst entity = new LocationMst();

//         // Set ALL fields from the first DTO
//         entity.setLocationMstID(dto.getLocationMstID());
//         entity.setLocation(dto.getLocation());
//         entity.setBranchEntity(dto.getBranchEntity());
//         entity.setCode(dto.getCode());
//         entity.setCompanyEntity(dto.getCompanyEntity());
//         entity.setShortName(dto.getShortName());
//         entity.setActiveDate(dto.getActiveDate());
//         entity.setAddress(dto.getAddress());
//         entity.setAddress1(dto.getAddress1());
//         entity.setAddress2(dto.getAddress2());
//         entity.setCountry(dto.getCountry());
//         entity.setState(dto.getState());
//         entity.setDistrict(dto.getDistrict());
//         entity.setPlace(dto.getPlace());
//         entity.setPincode(dto.getPincode());
//         entity.setLandlineNumber(dto.getLandlineNumber());
//         entity.setMobileNumber(dto.getMobileNumber());
//         entity.setEmail(dto.getEmail());
//         entity.setDesignation(dto.getDesignation());
//         entity.setEmployerName(dto.getEmployerName());
//         entity.setEmployerNumber(dto.getEmployerNumber());
//         entity.setEmployerEmail(dto.getEmployerEmail());
//         entity.setEsiRegion(dto.getEsiRegion());
//         entity.setWithaffectdate(dto.getWithaffectdate());

//         // Set authorization if available
//         if (dto.getAuthorization() != null) {
//             entity.setAuthorization(dto.getAuthorization());
//         }

//         return entity;
//     }

//     // =================== ENTITY → DTO ===================
//     @Override
//     public LocationDTO entityToDto(LocationMst entity) {
//         LocationDTO dto = new LocationDTO();

//         dto.setLocationMstID(entity.getLocationMstID());
//         dto.setLocation(entity.getLocation());
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
//         dto.setDesignation(entity.getDesignation());
//         dto.setEmployerName(entity.getEmployerName());
//         dto.setEmployerNumber(entity.getEmployerNumber());
//         dto.setEmployerEmail(entity.getEmployerEmail());
//         dto.setEsiRegion(entity.getEsiRegion());
//         dto.setWithaffectdate(entity.getWithaffectdate());
//         dto.setAuthorization(entity.getAuthorization());
//         return dto;
//     }

//     // =================== 8️⃣ SAVE ENTITY IN SERVICE ===================
//     @Override
//     @Transactional(rollbackFor = Exception.class)
//     protected LocationMst saveEntity(LocationMst entity, List<LocationDTO> dtos) {
//         LocationDTO dto = dtos.get(0);

//         try {
//             // ===== SAVE MAIN FIRST =====
//             LocationMst savedEntity = locationRepository.save(entity);

//             // ===== SAVE AUTHORIZATION WITH ID =====
//             // Get the authorization created in entityPopulate
//             Authorization auth = entity.getAuthorization();

//             // Set the ID
//             auth.setMstId(savedEntity.getLocationMstID());

//             // Save the authorization
//             Authorization savedAuth = authorizationRepository.save(auth);

//             // if log table present --->
//             // ===== SAVE LOG =====

//             // Create a Log entity first
//             LocationLog logEntity = new LocationLog();

//             // Set authId in DTO before passing to log service
//             dto.setAuthId(savedAuth.getAuthId());

//             // Now call saveEntity with the created entity
//             List<LocationLogDTO> logDtos = convertToLogDTO(dtos);
//             LocationLog savedLog = locationLogService.saveEntity(logEntity, logDtos);

//             // <------

//             return savedEntity;

//         } catch (Exception e) {
//             e.printStackTrace();
//             throw new RuntimeException("Error saving location and related entities: " + e.getMessage(), e);
//         }

//     }

//     // =================== 9️⃣ UTILITY METHODS ===================

//     private boolean isEmpty(String str) {
//         return str == null || str.trim().isEmpty();
//     }

//     private boolean isEmpty(CompanyMst company) {
//         if (company == null)
//             return true;
//         return company.getCompanyMstID() == null ||
//                 isEmpty(company.getCompany()) ||
//                 isEmpty(company.getCode());
//     }

//     private boolean isEmpty(BranchMst branch) {
//         if (branch == null)
//             return true;
//         return branch.getBranchMstID() == null ||
//                 isEmpty(branch.getBranch()) ||
//                 isEmpty(branch.getCode());
//     }

//     private List<LocationLogDTO> populateLogEntityfromEntity(LocationDTO dto) {
//         List<LocationLogDTO> DtoLogs = new ArrayList<>();
//         LocationLogDTO DtoLog = new LocationLogDTO();

//         DtoLog.setLocation(dto.getLocation());
//         DtoLog.setCompanyEntity(dto.getCompanyEntity());
//         DtoLog.setBranchEntity(dto.getBranchEntity());
//         DtoLog.setCode(dto.getCode());
//         DtoLog.setShortName(dto.getShortName());
//         DtoLog.setActiveDate(dto.getActiveDate());
//         DtoLog.setWithaffectdate(dto.getWithaffectdate());
//         DtoLog.setAddress(dto.getAddress());
//         DtoLog.setAddress1(dto.getAddress1());
//         DtoLog.setAddress2(dto.getAddress2());
//         DtoLog.setCountry(dto.getCountry());
//         DtoLog.setState(dto.getState());
//         DtoLog.setDistrict(dto.getDistrict());
//         DtoLog.setPlace(dto.getPlace());
//         DtoLog.setPincode(dto.getPincode());
//         DtoLog.setLandlineNumber(dto.getLandlineNumber());
//         DtoLog.setMobileNumber(dto.getMobileNumber());
//         DtoLog.setEmail(dto.getEmail());
//         DtoLog.setDesignation(dto.getDesignation());
//         DtoLog.setEmployerName(dto.getEmployerName());
//         DtoLog.setEmployerNumber(dto.getEmployerNumber());
//         DtoLog.setEmployerEmail(dto.getEmployerEmail());
//         DtoLog.setEsiRegion(dto.getEsiRegion());

//         DtoLogs.add(DtoLog);
//         return DtoLogs;
//     }

//     private List<LocationLogDTO> convertToLogDTO(List<LocationDTO> dtos) {

//         if (dtos == null || dtos.isEmpty())
//             return null;

//         List<LocationLogDTO> logDtos = new ArrayList<>();

//         for (LocationDTO dto : dtos) {
//             if (dto == null) {
//                 continue; // Skip null DTOs
//             }

//             LocationLogDTO logDto = new LocationLogDTO();

//             logDto.setLocation(dto.getLocation());
//             logDto.setAuthId(dto.getAuthId());
//             logDto.setBranchEntity(dto.getBranchEntity());
//             logDto.setCode(dto.getCode());
//             logDto.setCompanyEntity(dto.getCompanyEntity());
//             logDto.setShortName(dto.getShortName());
//             logDto.setAddress(dto.getAddress());
//             logDto.setAddress1(dto.getAddress1());
//             logDto.setAddress2(dto.getAddress2());
//             logDto.setCountry(dto.getCountry());
//             logDto.setState(dto.getState());
//             logDto.setDistrict(dto.getDistrict());
//             logDto.setPlace(dto.getPlace());
//             logDto.setPincode(dto.getPincode());
//             logDto.setLandlineNumber(dto.getLandlineNumber());
//             logDto.setMobileNumber(dto.getMobileNumber());
//             logDto.setEmail(dto.getEmail());
//             logDto.setActiveDate(dto.getActiveDate());
//             logDto.setDesignation(dto.getDesignation());
//             logDto.setEmployerName(dto.getEmployerName());
//             logDto.setEmployerNumber(dto.getEmployerNumber());
//             logDto.setEmployerEmail(dto.getEmployerEmail());
//             logDto.setEsiRegion(dto.getEsiRegion());
//             logDto.setWithaffectdate(dto.getWithaffectdate());
//             logDto.setAuthorizationDate(dto.getAuthorizationDate());
//             logDto.setAuthorizationStatus(dto.getAuthorizationStatus());
//             logDto.setUserCode(dto.getUserCode());
//             logDto.setLocatioinLogPK(dto.getLocationLogPK());
//             logDtos.add(logDto);
//         }
//         return logDtos;
//     }

//     private void populateLogEntityPKfromEntity(Long logPk, Long logRowNo, LocationDTO entity) {
//         for (LocationLogDTO entityLog : entity.getLocationDtoLogs()) {
//             LocationLogPK LogPK = new LocationLogPK();
//             LogPK.setLocationMstID(logPk);
//             LogPK.setRowNo(logRowNo);
//             entityLog.setLocatioinLogPK(LogPK);
//             entity.setLocationLogPK(LogPK);
//             logRowNo++;
//         }

//     }

// }
