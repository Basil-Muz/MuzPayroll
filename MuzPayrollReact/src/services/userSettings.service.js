// services/userSettings.service.js
import api from "../api/axiosInstance";

export const getUserSettingsList = (
{  companyId,
  userCode,
  userTypeId,
  userGrpId,
  locationId,}
) => {
    // const num =  parseInt(companyId, 10);
    // console.log("CompanyId",num)
  return api.get("/userSettings/getList", {
    params: {
      companyId,
      userCode: userCode || undefined,
      userTypeId,
       ...(userGrpId?.length && { userGrpId }),
      ...(locationId?.length && { locationId }),
    },
  });
};

export const saveUserSettings = (formData, mode) => {
  return api.post("/userSettings/save", formData,   {params: {mode}});
};
