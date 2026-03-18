import api from "../api/axiosInstance";

export const getOptionList = (userId) => {
  return api.get(`/option/fetchOption`, {
    params: { userId },
  });
};

export const getLocationGrpList = (bussinessGroupId) => {
  return api.get(`/locationGrp/locationGrplist`, {
    params: { bussinessGroupId },
  });
};

export const getInitDataList = async (optionId, active) => {
  return api.get(`optionMst/getdata`, {
    params: { optionId, active },
  });
};

export const saveLicenseAgreementData = (formData) => {
  return api.post("/licenseagreement/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
