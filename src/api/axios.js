import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// Injecter le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devhub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gérer les erreurs globalement
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("devhub_token");
      localStorage.removeItem("devhub_user");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

// Helper admin — ajoute le header mot de passe admin
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

adminApi.interceptors.request.use((config) => {
  const pw = sessionStorage.getItem("devhub_admin_pw");
  if (pw) config.headers["x-admin-password"] = pw;
  return config;
});

export default api;
