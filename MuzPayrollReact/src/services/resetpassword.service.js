import api from "../api/axiosInstance";

/* Normal change password */
// export const changePassword = (payload) => {
//   return api.post("/change-password", payload);
// };

/* Forgot password change */
// export const changePasswordForgot = (payload) => {
//   return api.post("/forgot-password/change-password", payload);
// };

/* Admin reset password */
export const resetPassword = (payload) => {
  return api.post("/resetpassword", payload);
};

export const getUsersDropdown = () => {
  return api.get("/users/dropdown"); 
};