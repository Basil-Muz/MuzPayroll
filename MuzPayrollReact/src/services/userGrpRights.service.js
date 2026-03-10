// services/locationgrouprights.service.js
import api from "../api/axiosInstance";

export const getUserGrpRightsList = (solutionId, userGroupId) => {
  return api.get("/userGrpRights/getGrpList", {
    params: {
      solutionId,
      userGroupId,
    },
  });
};

export const saveUserGrpRights = (formData) => {
  return api.post("/userGrpRights/save", formData);
};