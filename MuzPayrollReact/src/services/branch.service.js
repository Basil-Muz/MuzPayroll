// services/branch.service.js
import api from "../api/axiosInstance";

// Fetch Branch amendment list
export const getBranchAmendList = (branchId) => {
  return api.get(`/branch/getamendlist/${branchId}`);
};
//  Save branches
export const saveBranch = (data) => {
  return api.post("/branch/save", data);
};

// Fetch branches by company
export const fetchBranchesByCompany = (companyId) => {
  return api.get(`branch/company/${companyId}`);
};
