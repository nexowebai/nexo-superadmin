import api from "@api";

const BASE = "/super-admin";

const MOCK_ORGS = [
  {
    id: 1,
    org_code: "NX-01",
    name: "Nexo Global Solutions",
    email: "contact@nexoglobal.com",
    subscription_tier: "Enterprise",
    status: "active",
    users_count: 124,
    max_users: 500,
    projects_count: 45,
    max_projects: 100,
    created_at: "2024-01-15T10:00:00Z",
    logo: null,
    business_type: "Tech & Innovation",
    mrr: "4,500.00",
    billing_cycle: "Monthly",
    churn_risk: "Low",
    tax_id: "TX-9920-X",
    region: "North America",
    admin: {
      full_name: "Sarah Jenkins",
      email: "sarah.j@nexoglobal.com",
      phone_number: "+1 (555) 012-3456",
      is_active: true,
    },
  },
  {
    id: 2,
    org_code: "NX-02",
    name: "Stark Industries",
    email: "tony@stark.com",
    subscription_tier: "Professional",
    status: "active",
    users_count: 86,
    max_users: 200,
    projects_count: 12,
    max_projects: 50,
    created_at: "2024-02-01T12:00:00Z",
    logo: null,
    business_type: "Defense & Robotics",
    mrr: "2,200.00",
    billing_cycle: "Yearly",
    churn_risk: "Low",
    tax_id: "TX-8831-Y",
    region: "Europe",
    admin: {
      full_name: "Pepper Potts",
      email: "pepper@stark.com",
      phone_number: "+1 (555) 987-6543",
      is_active: true,
    },
  },
  {
    id: 3,
    org_code: "NX-03",
    name: "Wayne Enterprises",
    email: "bruce@wayne.org",
    subscription_tier: "Basic",
    status: "active",
    users_count: 24,
    max_users: 50,
    projects_count: 5,
    max_projects: 10,
    created_at: "2024-02-10T09:00:00Z",
    logo: null,
    business_type: "Global Conglomerate",
    mrr: "800.00",
    billing_cycle: "Monthly",
    churn_risk: "Medium",
    tax_id: "TX-1102-Z",
    region: "North America",
    admin: {
      full_name: "Lucius Fox",
      email: "lucius@wayne.org",
      phone_number: "+1 (555) 444-5555",
      is_active: true,
    },
  },
  {
    id: 4,
    org_code: "NX-04",
    name: "Cyberdyne Systems",
    email: "skynet@cyberdyne.com",
    subscription_tier: "Professional",
    status: "disabled",
    users_count: 0,
    max_users: 300,
    projects_count: 0,
    max_projects: 75,
    created_at: "2024-02-15T14:00:00Z",
    logo: null,
    business_type: "Artificial Intelligence",
    mrr: "0.00",
    billing_cycle: "Monthly",
    churn_risk: "High",
    tax_id: "TX-0001-A",
    region: "Asia Pacific",
    disabled_reason: "Violation of safety protocols",
    admin: {
      full_name: "Miles Dyson",
      email: "miles@cyberdyne.com",
      phone_number: "+1 (555) 212-0000",
      is_active: false,
    },
  },
];

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
