import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setToken = (token: string) => {
  api.defaults.headers.Authorization = `Bearer ${token}`;
  localStorage.setItem("token", token);
};

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("api/v1/auth/login", { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("api/v1/auth/profile");
    return response.data;
  },
};

export const employeeAPI = {
  getAllEmployees: async () => {
    const response = await api.get("/api/v1/employees");
    return response.data;
  },
  getEmployeeById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  createEmployee: async (employeeData: any) => {
    const response = await api.post("api/v1/employees", employeeData);
    return response.data;
  },
  updateEmployee: async (id: string, employeeData: any) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },
  deleteEmployee: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export const leaveAPI = {
  getAllLeaves: async () => {
    const response = await api.get("api/v1/leave");
    return response.data;
  },
  getEmployeeLeaves: async (employeeId: string) => {
    const response = await api.get(`api/v1/leave/employee/${employeeId}`);
    return response.data;
  },
  createLeave: async (leaveData: any) => {
    const response = await api.post("api/v1/leave", leaveData);
    return response.data;
  },
  updateLeaveStatus: async (id: string, status: string) => {
    const response = await api.put(`api/v1/leave/${id}`, { status });
    return response.data;
  },
  deleteLeave: async (id: string) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },
};

export default api;
