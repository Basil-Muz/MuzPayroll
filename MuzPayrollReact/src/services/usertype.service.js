import api from "../api/axiosInstance";

// Fetch user Group amendment list
export const getUserTypesList = () => {
  return api.get("/userType/getAllTypes", {
  });
};