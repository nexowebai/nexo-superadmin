import api from "@api";
import { MOCK_ORGS } from "../constants/orgMockData";

const BASE = "/super-admin";

export const orgService = {
  getAll: async (params = {}) => {
    const { search, status, subscription_tier } = params;
    let filtered = [...MOCK_ORGS];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(q) ||
          org.org_code.toLowerCase().includes(q) ||
          org.email.toLowerCase().includes(q),
      );
    }

    if (status) {
      filtered = filtered.filter((org) => org.status === status);
    }

    if (subscription_tier) {
      filtered = filtered.filter(
        (org) =>
          org.subscription_tier.toLowerCase() ===
          subscription_tier.toLowerCase(),
      );
    }

    return {
      data: {
        organizations: filtered,
        pagination: {
          total: filtered.length,
          page: params.page || 1,
          limit: params.limit || 10,
          pages: Math.ceil(filtered.length / (params.limit || 10)),
        },
      },
    };
  },

  getById: async (id) => {
    const org = MOCK_ORGS.find((o) => o.id === Number(id));
    return { data: { organization: org } };
  },
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
