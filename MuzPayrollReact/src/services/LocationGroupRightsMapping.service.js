import api from "../api/axiosInstance";

export const getSolutionList = () => {
  return api.get(`/solution/fetchSolution`);
};

export const getBranchList = (userId, companyId) => {
  return api.get(`/entity/fetchBranch`, {
    params: { userId, companyId },
  });
};

export const getLocationGrpList = (bussinessGroupId) => {
  return api.get(`/locationGrp/locationGrplist`, {
    params: { bussinessGroupId },
  });
};

export const getInitDataList = async (solutionId, branchIds) => {
  const params = new URLSearchParams();

  params.append("solutionId", solutionId);

  branchIds.forEach((id) => {
    params.append("branchIds", id);
  });

  return api.get(`entity-rights/linkData?${params.toString()}`);
};

export const saveLocationGroupMappings = (formData) => {
  return api.post("/entity-rights/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
