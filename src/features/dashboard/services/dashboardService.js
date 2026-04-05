import api from '@api';

const BASE = '/super-admin';

export const dashboardService = {
    getStats: () => {
        // Mock data to prevent errors during development
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
    }
};

export default dashboardService;
