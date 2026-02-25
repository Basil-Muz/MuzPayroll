// services/user.service.js
import api from "../api/axiosInstance";

// Fetch user Group amendment list
export const getUserGroupsList = (companyId, activeStatusYN) => {
  return api.get("/userGrp/userGrplist", {
    params: {
      companyId,
      activeStatusYN,
    },
  });
};

export const getUserGroupById = (userGroupId) => {
  return api.get(`/userGrp/${userGroupId}`);
};

export const getUserGroupAmendById = (userGroupId) => {
  return api.get(`/userGrp/getamendlist/${userGroupId}`);
};

export const saveUserGroup = (formData, mode) => {
  return api.post("/userGrp/save", formData, { params: { mode: mode } });
};

export const searchUserGroup = (search) => {
  return api.get("/userGrp/user-groups", {
    params: {
      search,
      size: 10,
      sort: "UgmName,asc",
    },
  });
};
