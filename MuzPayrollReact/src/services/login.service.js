// services/auth.service.js
import api from "../api/axiosInstance";

export const loginUser = async ({ userCode, password }) => {
  try {
    const response = await api.post("/login", { userCode, password });
    return response.data; // return only data (like fetch)
  } catch (error) {
  // Server error
  if (error.response?.status >= 500) {
    throw new Error("Server error. Please try again later.");
  }

  // Backend validation/auth error
  if (error.response?.data) {
    throw error.response.data; // ✅ pass actual API response
  }

  throw new Error("Network error");
}
};
