import api from "../api/axiosInstance";

// list
export const getShiftGroupsList = (companyId, activeStatusYN) => {
  return api.get("/shiftGrp/shiftGrplist", {
    params: { companyId, activeStatusYN },
  });
};

// get by id
export const getShiftGroupById = (shiftGroupId) => {
  return api.get(`/shiftGrp/${shiftGroupId}`);
};

// amend list
export const getShiftGroupAmendById = (shiftGroupId) => {
  return api.get(`/shiftGrp/getamendlist/${shiftGroupId}`);
};

// save
export const saveShiftGroup = (formData, mode) => {
  return api.post("/shiftGrp/save", formData, { params: { mode } });
};

// search
export const searchShiftGroup = (search) => {
  return api.get("/shiftGrp/shift-groups", {
    params: {
      search,
      size: 10,
      sort: "SgmName,asc",
    },
  });
};
