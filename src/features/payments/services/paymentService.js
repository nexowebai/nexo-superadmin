import api from '@api';

const BASE = '/super-admin';

export const paymentService = {
    getAll: (params) => api.get(`${BASE}/payments`, { params }),
    getById: (id) => api.get(`${BASE}/payments/${id}`),
    getStats: () => api.get(`${BASE}/payments/stats`),
    refund: (id) => api.post(`${BASE}/payments/${id}/refund`),
};

export default paymentService;
