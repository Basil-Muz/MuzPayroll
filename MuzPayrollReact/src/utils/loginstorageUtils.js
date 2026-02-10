export const getLoginData=()=>
    JSON.parse(localStorage.getItem("loginData")|| "{}");
export const setLoginData = (data)=>
    localStorage.setItem("loginData",JSON.stringify(data));