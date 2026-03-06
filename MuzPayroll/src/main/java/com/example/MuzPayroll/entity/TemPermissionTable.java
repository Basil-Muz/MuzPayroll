package com.example.MuzPayroll.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class TemPermissionTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long temPermissionTableID;

    @ManyToOne
    @JoinColumn(name = "optionId", nullable = true)
    private OptionMst optionMst;

    @ManyToOne
    @JoinColumn(name = "solutionID", nullable = true)
    private SolutionMst solutionMst;
    
    public SolutionMst getSolutionMst() {
            return solutionMst;
        }

        public void setSolutionMst(SolutionMst solutionMst) {
            this.solutionMst = solutionMst;
        }

    public OptionMst getOptionMst() {
        return optionMst;
    }

    public void setOptionMst(OptionMst optionMst) {
        this.optionMst = optionMst;
    }

        public Long getTemPermissionTableID() {
        return temPermissionTableID;
    }

    public void setTemPermissionTableID(Long temPermissionTableID) {
        this.temPermissionTableID = temPermissionTableID;
    }
}
