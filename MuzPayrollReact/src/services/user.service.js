// services/user.service.js
import api from "../api/axiosInstance";

// Fetch company amendment list
export const getUserGroupsList = (entityId) => {
  return api.get(`/userGrp/userGrplist/${entityId}`);
};

// export const saveUserGroup = (formData ) => {
//   return api.post("/userGrp/save", formData)
// };
export const saveUserGroup = (formData) => {
  api.post("/userGrp/save", formData, { params: { mode: "INSERT" } });
};
