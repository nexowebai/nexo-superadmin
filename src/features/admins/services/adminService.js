import api from "@api";

const BASE = "/super-admin";

export const adminService = {
  getAll: (params) => api.get(`${BASE}/admins`, { params }),
  getById: (id) => api.get(`${BASE}/admins/${id}`),
  create: (data) => api.post(`${BASE}/admins`, data),
  update: (id, data) => api.put(`${BASE}/admins/${id}`, data),
  delete: (id) => api.delete(`${BASE}/admins/${id}`),
};

export default adminService;
