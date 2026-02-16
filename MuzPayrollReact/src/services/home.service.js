// services/entity.service.js
import api from "../api/axiosInstance";

// Fetch companies
export const fetchCompanies = async (userId) => {
  const response = await api.get("/entity/fetchCompany", {
    params: { userId },
  });
  return response.data; //same as fetch().json()
};

// Fetch branches
export const fetchBranch = async (userId, companyId) => {
  const response = await api.get("/entity/fetchBranch", {
    params: { userId, companyId },
  });
  return response.data;
};

// Fetch locations
export const fetchLocation = async (userId, companyId, branchId) => {
  const response = await api.get("/entity/fetchLocation", {
    params: { userId, companyId, branchId },
  });
  return response.data;
};
