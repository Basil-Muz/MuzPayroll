package com.example.MuzPayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.MuzPayroll.entity.MenuThemeDtl;

@Repository
public interface MenuThemeDtlRepository extends JpaRepository<MenuThemeDtl, Long> {

    @Modifying
    @Transactional
    @Query(value = """
            INSERT INTO menu_theme_dtl (
                mtd_menu_themeid,
                mtd_menu_row_no,
                mtd_optionyn,
                mtd_optionid,
                mtd_display_name,
                mtd_group_desc,
                mtd_parent_menu_row_no,
                mtd_menu_level_no,
                mtd_sort_order
            )
            SELECT
                :menuThemeId,
                t.mtd_menu_row_no,
                t.mtd_optionyn,
                t.mtd_optionid,
                t.mtd_display_name,
                t.mtd_group_desc,
                t.mtd_parent_menu_row_no,
                t.mtd_menu_level_no,
                t.mtd_sort_order
            FROM menu_theme_template t
            WHERE t.solution_id = :solutionId
            """, nativeQuery = true)
    void insertFromTemplate(
            @Param("menuThemeId") Long menuThemeId,
            @Param("solutionId") Long solutionId);
}
