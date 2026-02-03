// services/branch.service.js
import api from "../api/axiosInstance";

// Fetch Branch amendment list
export const getBranchAmendList = (branchId) => {
  return api.get(
    `/branch/getamendlist/${branchId}`
  );
};

export const saveBranch = (data) => {
  return api.post("/branch/save", data);
};
