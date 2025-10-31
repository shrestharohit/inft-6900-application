import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// return current user
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user.id)
  if (user.id) config.headers["x-user-id"] = user.id;

  return config;
});

export default api;
