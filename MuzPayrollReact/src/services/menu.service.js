import api from "../api/axiosInstance";

export const fetchMainMenu = (
  transtype,
  transsubtype,
  userId,
  solutionId,
  entityHierarchyId,
  productid,
  menu_row_no,
) => {
  return api.get(`/menu/mainmenu`, {
    params: {
      transtype,
      transsubtype,
      userId,
      solutionId,
      entityHierarchyId,
      productid,
      menu_row_no,
    }
  });
};
