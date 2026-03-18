// services/user.service.js

import api from "../api/axiosInstance";

// Fetch user list
export const getUsersList = (companyId, activeStatusYN) => {
  return api.get("/user/userlist", {
    params: {
      companyId,
      activeStatusYN,
    },
  });
};

// Fetch user by ID
export const getUserById = (userId) => {
  return api.get(`/user/${userId}`);
};

// Fetch user amendment list
// export const getUserAmendById = (userId) => {
//   return api.get(`/user/getamendlist/${userId}`);
// };

// Save user
export const saveUser = (formData, mode) => {
  return api.post("/user/save", formData, {
    params: { mode: mode },
  });
};

// Search users
export const searchUser = (search) => {
  return api.get("/user/users", {
    params: {
      search,
      size: 10,
      sort: "userName,asc",
    },
  });
};