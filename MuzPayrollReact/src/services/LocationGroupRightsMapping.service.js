import api from "../api/axiosInstance";

export const getSolutionList = () => {
  return api.get(`/solution/fetchSolution`);
};

export const getBranchList = (userId, companyId) => {
  return api.get(`/entity/fetchBranch`, {
    params: { userId, companyId },
  });
};
