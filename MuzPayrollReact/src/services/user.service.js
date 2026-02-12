// services/user.service.js
import api from "../api/axiosInstance";

// Fetch company amendment list
export const getUserGroupsList = (entityId) => {
  return api.get(`/userGrp/userGrplist/${entityId}`);
};