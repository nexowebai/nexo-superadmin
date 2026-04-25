import api from "@api";

const BASE = "/super-admin";

// Realistic Mock Data for development
const MOCK_ORGS = [
  {
    id: 1,
    org_code: "NX-01",
    name: "Nexo Global Solutions",
    email: "contact@nexoglobal.com",
    subscription_tier: "Enterprise",
    status: "active",
    users_count: 124,
    created_at: "2024-01-15T10:00:00Z",
    logo: null,
    business_type: "Tech & Innovation"
  },
  {
    id: 2,
    org_code: "NX-02",
    name: "Stark Industries",
    email: "tony@stark.com",
    subscription_tier: "Professional",
    status: "active",
    users_count: 86,
    created_at: "2024-02-01T12:00:00Z",
    logo: null,
    business_type: "Defense & Robotics"
  },
  {
    id: 3,
    org_code: "NX-03",
    name: "Wayne Enterprises",
    email: "bruce@wayne.org",
    subscription_tier: "Basic",
    status: "active",
    users_count: 24,
    created_at: "2024-02-10T09:00:00Z",
    logo: null,
    business_type: "Global Conglomerate"
  },
  {
    id: 4,
    org_code: "NX-04",
    name: "Cyberdyne Systems",
    email: "skynet@cyberdyne.com",
    subscription_tier: "Professional",
    status: "warning",
    users_count: 210,
    created_at: "2024-02-15T14:00:00Z",
    logo: null,
    business_type: "Artificial Intelligence"
  }
];

export const orgService = {
  getAll: async (params = {}) => {
    const { search, status, subscription_tier } = params;

    // TODO: Switch to real API when backend is ready
    // return api.get(`${BASE}/organizations`, { params });

    // Mock filtering logic for development
    let filtered = [...MOCK_ORGS];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(q) || 
        org.org_code.toLowerCase().includes(q) ||
        org.email.toLowerCase().includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter(org => org.status === status);
    }

    if (subscription_tier) {
      filtered = filtered.filter(org => org.subscription_tier.toLowerCase() === subscription_tier.toLowerCase());
    }

    return {
      data: {
        organizations: filtered,
        pagination: {
          total: filtered.length,
          page: params.page || 1,
          limit: params.limit || 10,
          pages: Math.ceil(filtered.length / (params.limit || 10))
        }
      }
    };
  },

  getById: async (id) => {
    // Mock detail for development
    const org = MOCK_ORGS.find(o => o.id === Number(id));
    return { data: { organization: org } };
  },
  create: (data) => api.post(`${BASE}/organizations`, data),
  update: (id, data) => api.put(`${BASE}/organizations/${id}`, data),
  delete: (id) => api.delete(`${BASE}/organizations/${id}`),
  enable: (id) => api.patch(`${BASE}/organizations/${id}/enable`),
  disable: (id, reason) => api.patch(`${BASE}/organizations/${id}/disable`, { reason }),
  updatePlan: (id, data) => api.patch(`${BASE}/organizations/${id}/plan`, data),
  resetAdminPassword: (id, password) => 
    api.post(`${BASE}/organizations/${id}/reset-admin-password`, { new_password: password }),
};

export default orgService;
