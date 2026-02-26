// services/branch.service.js
import api from "../api/axiosInstance";

// Fetch Branch amendment list
export const getBranchAmendList = (branchId) => {
  return api.get(`/entity/getamendlist/${branchId}`);
};
//  Save branches
export const saveBranch = (data) => {
  return api.post("/entity/save", data);
};

// Fetch branches by company
export const fetchBranchesByCompany = (userId, companyId) => {
  return api.get(`/entity/fetchBranch`, {
    params: {
      userId,
      companyId,
    },
  });
};
