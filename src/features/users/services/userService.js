import api from "@api";

const BASE = "/super-admin";

export const userService = {
  getAll: (params) => api.get(`${BASE}/users`, { params }),
  getById: (id) => api.get(`${BASE}/users/${id}`),
  updateStatus: (id, is_active) =>
    api.patch(`${BASE}/users/${id}/status`, { is_active }),
};

export default userService;
