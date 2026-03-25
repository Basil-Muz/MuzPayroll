package com.example.MuzPayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserSettingsResponseDTO;
import com.example.MuzPayroll.repository.UserTypeMstRepository;
import com.example.MuzPayroll.service.UserSettingsService;

@RestController
@RequestMapping("/userSettings")
@CrossOrigin(origins = "*")
public class UserSettingsController {

    @Autowired
    private UserSettingsService userSettingsService;

    @GetMapping("/getList")
    public List<UserSettingsResponseDTO> getUserSettingsList(
            @RequestParam Long companyId,
            @RequestParam List<Long> userTypeId,
            @RequestParam(required = false) String userCode,
            @RequestParam(required = false) List<Long> userGrpId,
            @RequestParam(required = false) List<Long> locationId) {
        return userSettingsService.fetchAllData(companyId, userCode, userTypeId, userGrpId, locationId);
    }

    @PostMapping("/save")
    public Response<UserSettingsResponseDTO> saveEntityRightsGrp(@RequestBody List<UserSettingsResponseDTO> dto,
            @RequestParam String mode) {
        return userSettingsService.saveWrapper(dto, mode);
    }

}
