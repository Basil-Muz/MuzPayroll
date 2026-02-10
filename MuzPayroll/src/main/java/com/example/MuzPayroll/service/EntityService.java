package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.DTO.UserEntityDTO;
import com.example.MuzPayroll.repository.EntityRepository;

@Service
public class EntityService {

        @Autowired
        private EntityRepository entityRepository;

        public List<UserEntityDTO> getUserEntities(Integer userId, Integer mccId) {

                List<Object[]> rows = entityRepository.getUserEntities(userId, mccId);

                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }

        public List<UserEntityDTO> getUserLocation(Integer userId, Integer branchId, Integer mccId) {

                List<Object[]> rows = entityRepository.getUserLocation(userId, branchId, mccId);

                return rows.stream()
                                .map(r -> new UserEntityDTO(
                                                ((Number) r[0]).intValue(), // entityHierarchyId
                                                (String) r[1], // entityName
                                                (String) r[2]))
                                .toList();
        }
}
