// import { useEffect } from "react";
import React, { createContext, useContext, useState} from "react";
import { getLoginData, setLoginData } from "../utils/loginstorageUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getLoginData());
  const [menus, setMenus] = useState(null);
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);

//   useEffect(() => {
//   console.log("AUTH CONTEXT UPDATED ", user);
// }, [user]);

  //   useEffect(() => {
  //     if (user) {
  //       localStorage.setItem("loginData", JSON.stringify(user));
  //     }
  //   }, [user]);

  //   const updateUser = (updates) => {
  //     setUser((prev) => ({
  //       ...prev,
  //       ...updates,
  //     }));
  //     const stored = JSON.parse(localStorage.getItem("loginData")) || {};
  //     console.log("Data from Auth Provider Befor update",stored)
  //     localStorage.setItem(
  //       "loginData",
  //       JSON.stringify({
  //         ...stored,
  //         ...updates,
  //       }),
  //     );
  //         console.log("Data from Auth Provider After update",user)
  //   };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      setLoginData(next);
      return next;
    });
  };

  const login = (loginData) => {
    setUser(loginData);
    setMenus(null);
    setIsMenuLoaded(false);
    setLoginData(loginData);
  };

  const logout = () => {
    setUser(null);
    setMenus(null);
    setIsMenuLoaded(false);
    localStorage.clear();
    sessionStorage.clear();
  };

  const updateMenus = (menuData) => {
    setMenus(menuData);
    setIsMenuLoaded(true);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          updateUser,
          menus,
          isMenuLoaded,
          updateMenus,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
export const useAuth = () => useContext(AuthContext);
