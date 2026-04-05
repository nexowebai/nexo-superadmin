import api from "@api";

export const requestService = {
  getAll: (params) => api.get("/requests", { params }),
  approve: (id) => api.post(`/requests/${id}/approve`),
  reject: (id, reason) => api.post(`/requests/${id}/reject`, { reason }),
};

export default requestService;
