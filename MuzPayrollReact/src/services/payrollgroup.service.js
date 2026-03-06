import api from "../api/axiosInstance";

// Fetch payroll group list
export const getPayrollGroupsList = (companyId, activeStatusYN) => {
  return api.get("/payrollGrp/payrollGrplist", {
    params: {
      companyId,
      activeStatusYN,
    },
  });
};

// Get payroll group by ID (EDIT MODE)
export const getPayrollGroupById = (payrollGroupId) => {
  return api.get(`/payrollGrp/${payrollGroupId}`);
};

// Get amendment list (optional like user group)
export const getPayrollGroupAmendById = (payrollGroupId) => {
  return api.get(`/payrollGrp/getamendlist/${payrollGroupId}`);
};

// Save payroll group (CREATE / EDIT)
export const savePayrollGroup = (formData, mode) => {
  return api.post("/payrollGrp/save", formData, {
    params: { mode },
  });
};

// Search payroll group
export const searchPayrollGroup = (search) => {
  return api.get("/payrollGrp/payroll-groups", {
    params: {
      search,
      size: 10,
      sort: "PgmName,asc",
    },
  });
};