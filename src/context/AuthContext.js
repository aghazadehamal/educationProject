
import React, { createContext, useContext, useState } from "react";
import { loginRequest } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await loginRequest(email, password);

      console.log("LOGIN DATA IN CONTEXT:", data);

   
      const accessToken = data.accessToken;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      } else {
        console.warn("accessToken tapılmadı, backend cavabını yoxlayın");
      }


      const userInfo = {
        username: data.username,
        name: data.name,
        accesses: data.accesses,
      };
      setUser(userInfo);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
