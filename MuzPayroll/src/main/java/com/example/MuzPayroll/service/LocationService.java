package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.Authorization;
import com.example.MuzPayroll.entity.LocationLog;
import com.example.MuzPayroll.entity.LocationMst;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.AuthorizationRepository;

import com.example.MuzPayroll.repository.LocationLogRepository;
import com.example.MuzPayroll.repository.LocationRepository;
import com.example.MuzPayroll.repository.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class LocationService {

    @Autowired
    private LocationLogRepository locationLogRepository;

    @Autowired(required = true)
    private LocationRepository locationRepository;

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public ResponseEntity<String> saveLocation(Map<String, Object> data) {

        try {
            // Convert JSON → LocationMst
            LocationMst location = objectMapper.convertValue(data, LocationMst.class);

            // Save Location
            LocationMst savedLocation = locationRepository.save(location);

            // Create Authorization record
            Authorization auth = new Authorization();
            auth.setMstId(savedLocation.getLocationMstID());

            // Parse Date
            auth.setAuthorizationDate(LocalDate.parse(data.get("authorizationDate").toString()));

            // --- Handle authorizationStatus (must be 0 or 1) ---
            Object statusObj = data.get("authorizationStatus");
            if (statusObj == null) {
                return ResponseEntity.badRequest().body("authorizationStatus is required (0 or 1)");
            }

            int statusInt = Integer.parseInt(statusObj.toString());
            if (statusInt != 0 && statusInt != 1) {
                return ResponseEntity.badRequest().body("authorizationStatus must be ONLY 0 or 1");
            }

            auth.setAuthorizationStatus(statusInt == 1); // store as boolean true/false

            // --- Load UserMst ---
            String userCode = String.valueOf(data.get("user_code").toString());
            UserMst user = userRepository.findByUserCode(userCode);

            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid user_code: " + userCode);
            }

            auth.setUserMst(user);

            // Save authorization record
            Authorization savedAuth = authorizationRepository.save(auth);

            // 3. Create and save LocationLog

            LocationLog log = objectMapper.convertValue(data, LocationLog.class);

            // Set the ManyToOne relationship

            log.setAuthorization(savedAuth);

            // Save log (new row)
            locationLogRepository.save(log);

            return ResponseEntity.ok("Location saved successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving Location: " + e.getMessage());
        }
    }

}
