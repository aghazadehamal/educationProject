import api from "./axios";

export const loginRequest = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data; 
};


export const registerRequest = async (payload) => {

  const res = await api.post("/api/auth/register", payload);
  return res.data;
};