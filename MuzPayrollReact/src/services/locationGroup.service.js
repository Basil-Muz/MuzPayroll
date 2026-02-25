// services/locaiongroup.service.js
import api from "../api/axiosInstance";

// Fetch company amendment list
export const getLocationGroupsList = (companyId, activeStatusYN) => {
  return api.get("/locationGrp/locationGrplist", {
    params: {
      bussinessGroupId:companyId,
      ErmActiveYN:activeStatusYN,
    },
  });
};
export const searchLocationGroup =(search) => {
  return api.get("/locationGrp/search-locationGroups", {
    params: {
      search,
      size: 10,
      sort: "ErmName,asc",
    },
  });
};

export const saveLocationGroup = (formData, mode) => {
  return api.post("/locationGrp/save", formData, { params: { mode: mode } });
};

export const getLocationGroupById = (locationGroupId) => {
  return api.get(`/locationGrp/${locationGroupId}`);
};