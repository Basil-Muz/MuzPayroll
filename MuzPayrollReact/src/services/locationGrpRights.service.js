import api from "../api/axiosInstance";

// Fetch company amendment list
export const getLocationGrpRightssList = (solutionId, entityGroupId) => {
  return api.get("/entityGrpRights/getGrpList", {
    params: {
      solutionId,
      entityGroupId,
    },
  });
};
