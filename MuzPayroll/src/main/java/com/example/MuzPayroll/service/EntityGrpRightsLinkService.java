package com.example.MuzPayroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.DTO.EntityGrpRightsLinkDTO;
import com.example.MuzPayroll.repository.EntityGrpRightsLinkRepository;

@Service
public class EntityGrpRightsLinkService {

    @Autowired
    EntityGrpRightsLinkRepository entityGrpRightsLinkRepository;

    public List<EntityGrpRightsLinkDTO> getData(Long solutionId, List<Long> branchIds) {

        List<Object[]> rows = entityGrpRightsLinkRepository.getEntityGrpRightsLinkData(
                solutionId,
                branchIds.toArray(new Long[0]));

        return rows.stream()
                .map(r -> new EntityGrpRightsLinkDTO(
                        ((Number) r[0]).longValue(),
                        (String) r[1],
                        (String) r[2],
                        (String) r[3]))
                .toList();
    }

}
