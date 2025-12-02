import React, { createContext, useContext, useState } from "react";
import { loginRequest } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await loginRequest(email, password);

      const accessToken = data.accessToken;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      }

      const userInfo = {
        username: data.username,
        name: data.name,
        accesses: data.accesses,
        roles: data.roles,
        studentNumber: data.studentNumber,
      };

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
