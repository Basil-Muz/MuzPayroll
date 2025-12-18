package com.example.MuzPayroll.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.MuzPayroll.service.LocationService;

@RestController
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping("/saveLocation")
    public ResponseEntity<String> saveLocation(@RequestBody Map<String, Object> data) {
        return locationService.saveLocation(data);
    }

}
