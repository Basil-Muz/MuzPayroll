package com.example.MuzPayroll.service;

import com.example.MuzPayroll.DTO.LoginRequest;
import com.example.MuzPayroll.DTO.LoginResponse;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserMstService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CompanyRepository companyRepo;

    @Autowired
    private BranchRepository branchRepo;

    @Autowired
    private LocationRepository locationRepo;

    public LoginResponse login(LoginRequest request) {

        LoginResponse resp = new LoginResponse();
        resp.setSuccess(false);

        UserMst user = userRepo.findByUserCode(
            Long.parseLong(request.getUserCode().replace("@muziris", ""))
        );

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            resp.setMessage("Invalid login");
            return resp;
        }

        resp.setSuccess(true);
        resp.setMessage("Login successful");

        resp.setCompanyId(user.getCompanyEntity().getId());
        resp.setBranchId(user.getBranchEntity().getId());
        resp.setLocationId(user.getLocationEntity().getId());

        // ✅ SEND DROPDOWN DATA
        resp.setCompanyList(companyRepo.findAll());
        resp.setBranchList(branchRepo.findAll());
        resp.setLocationList(locationRepo.findAll());

        return resp;
    }
}
