import api from "../api/axiosInstance";

export const fetchMainMenu = (
  transtype,
  transsubtype,
  userId,
  solutionId,
  entityHierarchyId
) => {
  return api.get(`/menu/mainmenu`, {
    params: {
      transtype,
      transsubtype,
      userId,
      solutionId,
      entityHierarchyId
    }
  });
};
