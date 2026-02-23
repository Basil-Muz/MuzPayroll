import api from "../api/axiosInstance";

/*  Normal change password */
export const changePassword = (payload) => {
  return api.post("/change-password", payload);
};

/*  Forgot password change */
export const changePasswordForgot = (payload) => {
  return api.post("/forgot-password/change-password", payload);
};