package com.example.MuzPayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MuzPayroll.entity.LicenseAgreement;

@Repository
public interface LicenseAgreementRepository extends JpaRepository<LicenseAgreement, Long> {

    @Query(value = """
            SELECT
                em.etm_entityid AS companyId,
                lic.lic_branchs AS branches,
                lic.lic_locations AS locations,
                lic.lic_users AS users
                from entity_mst em
            LEFT JOIN license_agreement lic
            ON em.etm_entityid = lic.lic_entity_hierarchyid
            WHERE em.etm_entity_type_mccid = 13
            AND em.etm_entityid = :companyId
                                        """, nativeQuery = true)
    List<Object[]> getLicenseAgreementData(
            @Param("companyId") Long companyId);
}
