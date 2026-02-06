import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (email, password, role = "staff") =>
    api.post("/auth/register", { email, password, role }),
  me: () => api.get("/auth/me"),
};

// Patients API
export const patientsApi = {
  getAll: () => api.get("/patients"),
  getOne: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post("/patients", data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Claims API
export const claimsApi = {
  getAll: (params = {}) => api.get("/claims", { params }),
  getOne: (id) => api.get(`/claims/${id}`),
  create: (data) => api.post("/claims", data),
  update: (id, data) => api.put(`/claims/${id}`, data),
  delete: (id) => api.delete(`/claims/${id}`),
  export: (params = {}) =>
    api.get("/claims/export", {
      params,
      responseType: "blob",
    }),
};

// Claim Imports API
export const claimImportsApi = {
  getAll: () => api.get("/claim_imports"),
  getOne: (id) => api.get(`/claim_imports/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/claim_imports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
