export const loginUser = async({userCode,password})=>
{
    const response = await fetch("http://localhost:8087/login",{
        method : "POST",
        headers : {"content-Type":"application/json"},
        body : JSON.stringify({userCode,password}),
    });

    const data = await response.json();

    if(!response.ok && response.status >= 500){
        throw new Error("Server Error");
    }
    return data;
};