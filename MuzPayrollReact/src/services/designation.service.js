import api from "../api/axiosInstance";

/* ================= FETCH DESIGNATION LIST ================= */

export const getDesignationList = (companyId, activeStatusYN) => {
  return api.get("/designation/designationList", {
    params: {
      companyId,
      activeStatusYN,
    },
  });
};

/* ================= GET DESIGNATION BY ID ================= */

export const getDesignationById = (designationId) => {
  return api.get(`/designation/${designationId}`);
};

/* ================= GET AMENDMENT LIST ================= */

export const getDesignationAmendById = (designationId) => {
  return api.get(`/designation/getamendlist/${designationId}`);
};

/* ================= SAVE DESIGNATION ================= */

export const saveDesignation = (formData, mode) => {
  return api.post("/designation/save", formData, {
    params: { mode },
  });
};

/* ================= SEARCH DESIGNATION ================= */

export const searchDesignation = (search) => {
  return api.get("/designation/designations", {
    params: {
      search,
      size: 10,
      sort: "desName,asc",
    },
  });
};