import api from "../api/axiosInstance";

// Send OTP
export const sendOtp = async (userCode) => {
  const response = await api.post("/forgot-password/send-otp", {
    userCode,
  });
  return response.data;
};

// Verify OTP
export const verifyOtp = async (userCode, otp) => {
  const response = await api.post("/forgot-password/verify-otp", {
    userCode,
    otp,
  });
  return response.data;
};