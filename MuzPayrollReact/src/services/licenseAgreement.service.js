import api from "../api/axiosInstance";

export const getCompanyList = (userId) => {
  return api.get(`/entity/fetchCompany`, {
    params: { userId },
  });
};

export const getLocationGrpList = (bussinessGroupId) => {
  return api.get(`/locationGrp/locationGrplist`, {
    params: { bussinessGroupId },
  });
};

export const getInitDataList = async (companyId) => {
  return api.get(`licenseagreement/getdata`, {
    params: { companyId },
  });
};

export const saveLicenseAgreementData = (formData) => {
  return api.post("/licenseagreement/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
