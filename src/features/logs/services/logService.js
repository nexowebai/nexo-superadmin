import api from '@api';

export const logService = {
    getLogs: (params) => api.get('/system/logs', { params }),
};

export default logService;
