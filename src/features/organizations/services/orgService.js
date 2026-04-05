import api from "@api";

const BASE = "/super-admin";

export const orgService = {
  getAll: (params) => {
    // Return mock data for development - remove this once backend is ready
    return Promise.resolve({
      data: {
        organizations: [
          {
            id: 1,
            name: "Nexo Global Solutions",
            plan: "Enterprise",
            status: "active",
            userCount: 124,
            projectCount: 45,
            storageUsage: 78,
            created_at: "2024-01-15T10:00:00Z",
          },
          {
            id: 2,
            name: "Stark Industries",
            plan: "Pro",
            status: "active",
            userCount: 86,
            projectCount: 12,
            storageUsage: 42,
            created_at: "2024-02-01T12:00:00Z",
          },
          {
            id: 3,
            name: "Wayne Enterprises",
            plan: "Basic",
            status: "active",
            userCount: 24,
            projectCount: 8,
            storageUsage: 15,
            created_at: "2024-02-10T09:00:00Z",
          },
          {
            id: 4,
            name: "Cyberdyn Systems",
            plan: "Pro",
            status: "warning",
            userCount: 210,
            projectCount: 64,
            storageUsage: 92,
            created_at: "2024-02-15T14:00:00Z",
          },
        ],
        pagination: { total: 4, pages: 1 },
      },
    });
  },
  getById: (id) =>
    Promise.resolve({
      data: { id, name: "Mock Org", plan: "Pro", status: "active" },
    }),
  create: (data) => api.post(`${BASE}/organizations`, data),
  update: (id, data) => api.put(`${BASE}/organizations/${id}`, data),
  delete: (id) => api.delete(`${BASE}/organizations/${id}`),
  enable: (id) => api.patch(`${BASE}/organizations/${id}/enable`),
  disable: (id, reason) =>
    api.patch(`${BASE}/organizations/${id}/disable`, { reason }),
  updatePlan: (id, data) => api.patch(`${BASE}/organizations/${id}/plan`, data),
  resetAdminPassword: (id, password) =>
    api.post(`${BASE}/organizations/${id}/reset-admin-password`, {
      new_password: password,
    }),
};

export default orgService;
