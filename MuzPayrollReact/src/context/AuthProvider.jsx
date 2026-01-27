import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("loginData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("loginData", JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
    const stored = JSON.parse(localStorage.getItem("loginData")) || {};

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        ...updates,
      }),
    );
  };

  const login = (loginData) => {
    setUser(loginData);
    localStorage.setItem("loginData", JSON.stringify(loginData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <>
      <AuthContext.Provider value={{ user, login, logout, updateUser }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
export const useAuth = () => useContext(AuthContext);
