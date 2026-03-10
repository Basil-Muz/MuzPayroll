package com.example.MuzPayroll.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tem_user_permission_table")
public class TempUserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "option_id", nullable = false)
    private Long optionId;

    @Column(name = "solution_id", nullable = false)
    private Long solutionId;

    public Long getId() {
        return id;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public Long getSolutionId() {
        return solutionId;
    }

    public void setSolutionId(Long solutionId) {
        this.solutionId = solutionId;
    }
}