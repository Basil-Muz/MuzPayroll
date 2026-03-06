import api from "../api/axiosInstance";

/* ================= GET LIST ================= */

export const getDepartmentsList = (companyId, activeStatusYN) => {
  return api.get("/department/list", {
    params: {
      companyId,
      activeStatusYN,
    },
  });
};

/* ================= GET BY ID ================= */

export const getDepartmentById = (departmentId) => {
  return api.get(`/department/${departmentId}`);
};

/* ================= SAVE ================= */

export const saveDepartment = (data, mode) => {
  return api.post("/department/save", data, {
    params: { mode },
  });
};

/* ================= SEARCH ================= */

export const searchDepartment = (search) => {
  return api.get("/department/search", {
    params: {
      search,
      size: 10,
      sort: "depName,asc",
    },
  });
};