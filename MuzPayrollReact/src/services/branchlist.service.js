import api from "../api/axiosInstance";

// All branches
export const fetchAllBranch = async (companyId) => {
  const response = await api.get("/entity/branchlist", {
    params: { companyId },
  });
  return response.data;
};

// Active branches
export const fetchActiveBranch = async (companyId) => {
  const response = await api.get("/entity/branchlist", {
    params: { activeStatusYN: true, companyId },
  });
  return response.data;
};

// Inactive branches
export const fetchInactiveBranch = async (companyId) => {
  const response = await api.get("/entity/branchlist", {
    params: { activeStatusYN: false, companyId },
  });
  return response.data;
};
