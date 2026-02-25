export const getLoginData=()=>
    JSON.parse(localStorage.getItem("loginData")|| "{}");
export const setLoginData = (data)=>
    localStorage.setItem("loginData",JSON.stringify(data));

// MENU
export const getMenuData = () =>
  JSON.parse(localStorage.getItem("menuData") || "[]");

export const setMenuData = (data) =>
  localStorage.setItem("menuData", JSON.stringify(data));