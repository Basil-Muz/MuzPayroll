import api from "../api/axiosInstance";

// All companies
export const fetchAllCompanies = async () => {
  const response = await api.get("/entity/companylist");
  return response.data;
};

// Active companies
export const fetchActiveCompanies = async () => {
  const response = await api.get("/entity/companylist", {
    params: { activeStatusYN: true },
  });
  return response.data;
};

// Inactive companies
export const fetchInactiveCompanies = async () => {
  const response = await api.get("/entity/companylist", {
    params: { activeStatusYN: false },
  });
  return response.data;
};
