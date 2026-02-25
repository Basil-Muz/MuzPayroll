// services/company.service.js
import api from "../api/axiosInstance";

// Fetch company amendment list
export const getCompanyAmendList = (companyId) => {
  return api.get(`/entity/getamendlist/${companyId}`);
};

export const saveCompany = (data) => {
  return api.post("/entity/save", data);
};

// export const fetchCompany = (userId) => {
//   return api.get(`/entity/fetchCompany/${userId}`);
// };

export const fetchCompany = (userId) => {
  return api.get("/entity/fetchCompany", {
    params: {
      userId,
    },
  });
};
