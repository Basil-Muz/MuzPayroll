// services/auth.service.js
import api from "../api/axiosInstance";

export const loginUser = async ({ userCode, password }) => {
  try {
    const response = await api.post("/login", { userCode, password });
    return response.data; // ✅ return only data (like fetch)
  } catch (error) {
    if (error.response?.status >= 500) {
      throw new Error("Server Error");
    }
    throw error;
  }
};
