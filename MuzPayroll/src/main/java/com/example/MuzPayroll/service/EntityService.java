package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.DTO.UserEntityDTO;
import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.repository.EntityRepository;
import com.example.MuzPayroll.repository.UserRepository;


@Service
public class EntityService {

        @Autowired
        private EntityRepository entityRepository;

        @Autowired
        private UserRepository userRepository;

        public List<UserEntityDTO> getCompany(Long userId, Long mccId) {

                UserMst user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Long userType = user.getUserTypeMst().getUgmUserGroupID();

                List<Object[]> rows;

                if (userType == 100011) {
                        rows = entityRepository.getAdminCompany(mccId);
                } else {
                        rows = entityRepository.getUserCompany(userId, mccId);
                }
                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }

        public List<UserEntityDTO> getUserBranch(Long userId, Long companyId, Long mccId) {
                UserMst user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Long userType = user.getUserTypeMst().getUgmUserGroupID();

                List<Object[]> rows;

                if ( userType == 100011 || userType == 100012) {
                        rows = entityRepository.getAdminBranch(companyId, mccId);
                } else {
                        rows = entityRepository.getUserBranch(userId, companyId, mccId);
                }

                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }

        public List<UserEntityDTO> getUserLocation(Long userId, Long companyId, Long branchId, Long mccId) {
                UserMst user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Long userType = user.getUserTypeMst().getUgmUserGroupID();

                List<Object[]> rows;

                if ( userType == 100011 || userType == 100012) {
                        rows = entityRepository.getAdminLocation(companyId, branchId, mccId);
                } else {
                        rows = entityRepository.getUserLocation(userId, branchId, mccId);
                }

                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }
}
