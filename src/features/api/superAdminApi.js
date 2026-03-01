import api from '@services/api';

const BASE = '/super-admin';

export const dashboardApi = {
    getStats: () => {
        // Return mock data to prevent 401/404 errors during development
        return Promise.resolve({
            data: {
                stats: {
                    summary: [
                        { key: "total_organizations", value: 124 },
                        { key: "active_users", value: 8432 },
                        { key: "total_projects", value: 45 },
                        { key: "system_health", value: 98 }
                    ],
                    charts: {
                        organization_status: [
                            { name: "active", value: 85 },
                            { name: "disabled", value: 15 },
                            { name: "pending", value: 24 }
                        ],
                        plan_distribution: [
                            { name: "basic", value: 45 },
                            { name: "pro", value: 62 },
                            { name: "enterprise", value: 17 }
                        ]
                    },
                    recent_notifications: [
                        { id: 1, title: "New organization registered", type: "system", created_at: new Date().toISOString(), is_read: false },
                        { id: 2, title: "Server usage alert", type: "warning", created_at: new Date().toISOString(), is_read: true }
                    ]
                }
            }
        });
    },
};

export const organizationsApi = {
    getAll: (params) => {
        return Promise.resolve({
            data: {
                organizations: [
                    { id: 1, name: "Nexo Global Solutions", plan: "Enterprise", status: "active", userCount: 124, projectCount: 45, storageUsage: 78, created_at: "2024-01-15T10:00:00Z" },
                    { id: 2, name: "Stark Industries", plan: "Pro", status: "active", userCount: 86, projectCount: 12, storageUsage: 42, created_at: "2024-02-01T12:00:00Z" },
                    { id: 3, name: "Wayne Enterprises", plan: "Basic", status: "active", userCount: 24, projectCount: 8, storageUsage: 15, created_at: "2024-02-10T09:00:00Z" },
                    { id: 4, name: "Cyberdyn Systems", plan: "Pro", status: "warning", userCount: 210, projectCount: 64, storageUsage: 92, created_at: "2024-02-15T14:00:00Z" },
                ],
                pagination: { total: 4, pages: 1 }
            }
        });
    },
    getById: (id) => Promise.resolve({ data: { id, name: "Mock Org", plan: "Pro", status: "active" } }),
    create: (data) => api.post(`${BASE}/organizations`, data),
    update: (id, data) => api.put(`${BASE}/organizations/${id}`, data),
    delete: (id) => api.delete(`${BASE}/organizations/${id}`),
    enable: (id) => api.patch(`${BASE}/organizations/${id}/enable`),
    disable: (id, reason) => api.patch(`${BASE}/organizations/${id}/disable`, { reason }),
    updatePlan: (id, data) => api.patch(`${BASE}/organizations/${id}/plan`, data),
    resetAdminPassword: (id, password) => api.post(`${BASE}/organizations/${id}/reset-admin-password`, { new_password: password }),
};

export const adminsApi = {
    getAll: (params) => api.get(`${BASE}/admins`, { params }),
    getById: (id) => api.get(`${BASE}/admins/${id}`),
    create: (data) => api.post(`${BASE}/admins`, data),
    update: (id, data) => api.put(`${BASE}/admins/${id}`, data),
    delete: (id) => api.delete(`${BASE}/admins/${id}`),
};

export const requestsApi = {
    getAll: (params) => api.get(`${BASE}/organization-requests`, { params }),
    approve: (id) => api.patch(`${BASE}/organization-requests/${id}/approve`),
    reject: (id, reason) => api.patch(`${BASE}/organization-requests/${id}/reject`, { rejection_reason: reason }),
};

export const paymentsApi = {
    getAll: (params) => api.get(`${BASE}/payments`, { params }),
    getById: (id) => api.get(`${BASE}/payments/${id}`),
    getStats: () => api.get(`${BASE}/payments/stats`),
    refund: (id) => api.post(`${BASE}/payments/${id}/refund`),
};

export const systemApi = {
    getSettings: () => api.get(`${BASE}/system/settings`),
    updateSettings: (data) => api.put(`${BASE}/system/settings`, data),
    getLogs: (params) => api.get(`${BASE}/system/logs`, { params }),
};

export const usersApi = {
    getAll: (params) => api.get(`${BASE}/users`, { params }),
    getById: (id) => api.get(`${BASE}/users/${id}`),
    updateStatus: (id, is_active) => api.patch(`${BASE}/users/${id}/status`, { is_active }),
};

export const notificationsApi = {
    getAll: (params) => {
        return Promise.resolve({
            data: {
                notifications: [],
                pagination: { pages: 1 },
                unread_count: 0
            }
        });
    },
    getCount: () => Promise.resolve({ data: { count: 0 } }),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/mark-all-read'),
    delete: (id) => api.delete(`/notifications/${id}`),
    markAsSeen: (ids) => api.post('/notifications/seen', { notification_ids: ids }),
};
