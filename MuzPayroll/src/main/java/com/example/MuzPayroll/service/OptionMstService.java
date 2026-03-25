package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.DTO.StatusUpdateDTO;
import com.example.MuzPayroll.repository.OptionMstRepository;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class OptionMstService {

        @Autowired
        private OptionMstRepository optionMstRepository;

        @Autowired
        private UserRepository userRepository;

        public List<StatusUpdateDTO> getOptions(Long userId) {
                userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return optionMstRepository.findAll()
                                .stream()
                                .map(o -> new StatusUpdateDTO(
                                                o.getOpmOptionID(),
                                                o.getOpmName()))
                                .toList();
        }
}

/*
 * 
 * 51 "JOBGRADE"
 * 52 "GOVJOBGRADE"
 * 2 "COMPANY"
 * 4 "LOCATION"
 * 3 "BRANCH"
 * 69 "SHIFTGROUP"
 * 50 "DESIGNATION"
 * 107 "USER"
 * 120 USERGROUP User Group
 * 56 "ADVANCETYPE"
 * 216 "DA_CENTRE"
 * 54 "ATTENDANCEANDLEAVE"
 * 5 SUBENTITY Department
 * 228 ATTRIBUTE Employee Attribute
 * 229 ATTRIBUTE_VALUE Employee Attribute Value
 * 53 EMPLOYEETYPE Employee Type
 * 121 ENTITYGROUP Location Group
 * 58 PAYROLLGROUP Payroll Group
 * 55 SALARYHEAD Salary Head
 * 62 STATUTORYREPORTSANDLETTER Reports and Letters
 * 
 */