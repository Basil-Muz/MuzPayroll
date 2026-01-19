package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.LocationLog;
import com.example.MuzPayroll.entity.LocationLogPK;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.entity.DTO.AmendListDTO;
import com.example.MuzPayroll.entity.DTO.BranchDTO;
import com.example.MuzPayroll.entity.DTO.FormListDTO;
import com.example.MuzPayroll.entity.DTO.LocationDTO;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.repository.LocationLogRepository;
import com.example.MuzPayroll.repository.LocationRepository;
import com.example.MuzPayroll.service.LocationService;

@RestController
@RequestMapping("/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private LocationLogRepository locationLogRepository;

    @PostMapping("/save")
    public Response<LocationDTO> saveLocation(@ModelAttribute LocationDTO dto, @RequestParam String mode) {
        return locationService.saveWrapper(dto, mode);
    }

    // TO get the location from locationmst by giving MstID
    @GetMapping("/{locationMstID}")
    public ResponseEntity<LocationMst> getLocationById(
            @PathVariable @NonNull Long locationMstID) {

        return locationRepository.findById(locationMstID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // TO get the companyMst and the List of Logs y using MstID
    @GetMapping("/getamendlist/{locationMstID}")
    public ResponseEntity<LocationDTO> getLocationByMstId(@PathVariable Long locationMstID) {

        LocationDTO dto = locationService.getLocationWithLogs(locationMstID);
        return ResponseEntity.ok(dto);
    }

    // To get the Company list from the MST table
    @GetMapping("/locationList")
    public ResponseEntity<List<FormListDTO>> getLocationList() {

        List<LocationMst> list = locationRepository.findAllLocation();

        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<FormListDTO> response = list.stream()
                .map(entity -> {
                    FormListDTO dto = new FormListDTO();
                    dto.setMstID(entity.getLocationMstID());
                    dto.setCode(entity.getCode());
                    dto.setName(entity.getLocation());
                    dto.setShortName(entity.getShortName());
                    dto.setActiveDate(entity.getActiveDate());
                    // dto.setStatus();
                    // dto.setInactiveDate();
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    // TO get the Location data from LocationLog by giving MstID and rowno
    @GetMapping("/amend/{locationMstID}/{rowNo}")
    public ResponseEntity<LocationLog> getLocationLogById(
            @PathVariable Long locationMstID,
            @PathVariable Long rowNo) {

        LocationLogPK pk = new LocationLogPK();
        pk.setLocationMstID(locationMstID);
        pk.setRowNo(rowNo);

        return locationLogRepository.findById(pk)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // To get the amend list
    @GetMapping("/amend/{locationMstID}")
    public ResponseEntity<List<AmendListDTO>> getLocationLogs(
            @PathVariable Long locationMstID) {

        List<LocationLog> logs = locationLogRepository.findAllLogsByLocationMstID(locationMstID);

        if (logs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<AmendListDTO> response = logs.stream()
                .map(log -> {
                    AmendListDTO dto = new AmendListDTO();
                    dto.setMstID(log.getLocationLogPK().getLocationMstID());
                    dto.setRowNo(log.getLocationLogPK().getRowNo());
                    dto.setAmendNo(log.getAmendNo());
                    dto.setAuthorizationDate(log.getAuthorization().getAuthorizationDate());
                    dto.setAuthorizationStatus(log.getAuthorization().getAuthorizationStatus());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

}
