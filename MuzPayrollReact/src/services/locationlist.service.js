import api from "../api/axiosInstance";

// All locations
export const fetchAllLocation = async (companyId, branchId) => {
  const response = await api.get("/entity/locationlist", {
    params: { companyId, branchId },
  });
  return response.data;
};

// Active locations
export const fetchActiveLocation = async (companyId, branchId) => {
  const response = await api.get("/entity/locationlist", {
    params: { activeStatusYN: true, companyId, branchId },
  });
  return response.data;
};

// Inactive locations
export const fetchInactiveLocation = async (companyId, branchId) => {
  const response = await api.get("/entity/locationlist", {
    params: { activeStatusYN: false, companyId, branchId },
  });
  return response.data;
};
