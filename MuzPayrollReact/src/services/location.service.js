import api from "../api/axiosInstance";

//  Fetch location amendment list by locationId
export const getLocationAmendList = (locationId) => {
  return api.get(`/location/getamendlist/${locationId}`);
};

//  Save location
export const saveLocation = (data) => {
  return api.post("/location/save", data);
};