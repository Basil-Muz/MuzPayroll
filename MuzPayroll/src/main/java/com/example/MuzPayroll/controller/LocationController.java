// package com.example.MuzPayroll.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.ModelAttribute;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.MuzPayroll.entity.DTO.LocationDTO;
// import com.example.MuzPayroll.entity.DTO.Response;
// import com.example.MuzPayroll.service.LocationService;

// @RestController
// @RequestMapping("/location")

// @CrossOrigin(origins = "*")
// public class LocationController {

//     @Autowired
//     private LocationService locationService;

//     @PostMapping("/save")
//     public Response<LocationDTO> saveBranch(@ModelAttribute LocationDTO dto) {
//         return locationService.saveWrapper(dto);
//     }

// }
