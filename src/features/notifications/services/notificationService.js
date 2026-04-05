import api from '@api';

export const notificationService = {
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

export default notificationService;
