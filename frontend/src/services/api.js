import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error);
  }
);

export const loginAdmin = (credentials) => api.post("/auth/login", credentials);

export const getMenuItems = (params) => api.get("/menu", { params });
export const getMenuGrouped = (params) => api.get("/menu/grouped", { params });
export const addMenuItem = (payload) => api.post("/menu", payload);
export const updateMenuItem = (id, payload) => api.patch(`/menu/${id}`, payload);

export const getConsumers = (params) => api.get("/consumers", { params });
export const addConsumer = (payload) => api.post("/consumers", payload);

export const placeOrder = (payload) => api.post("/orders", payload);
export const getOrderAnalytics = () => api.get("/orders/analytics");

export const MENU_CATEGORIES = ["Starter", "Main Course", "Dessert", "Beverage"];

export default api;
