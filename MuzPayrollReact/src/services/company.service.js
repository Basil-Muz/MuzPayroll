// services/company.service.js
import api from "../api/axiosInstance";

// Fetch company amendment list
export const getCompanyAmendList = (companyId) => {
  return api.get(`/company/getamendlist/${companyId}`);
};

export const saveCompany = (data) => {
  return api.post("/entity/save", data);
};

export const fetchCompany = (companyId) => {
  return api.get(`/company/${companyId}`);
};
