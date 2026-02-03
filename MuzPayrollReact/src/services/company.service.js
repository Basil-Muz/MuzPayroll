// services/company.service.js
import axios from "axios";

// Fetch company amendment list
export const getCompanyAmendList = (companyId) => {
  return axios.get(
    `http://localhost:8087/company/getamendlist/${companyId}`
  );
};

export const saveCompany = (data) => {
  return axios.post(
    "http://localhost:8087/company/save",data
  );
};