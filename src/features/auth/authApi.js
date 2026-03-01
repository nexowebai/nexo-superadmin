import api from '@services/api';

const AUTH = '/auth';

export const authApi = {
    login: (credentials) => {
        // Mock successful login for Super Admin
        return Promise.resolve({
            data: {
                access_token: 'mock-super-admin-token-12345',
                expires_in: 86400,
                user: {
                    id: 'mock-user-1',
                    email: credentials.email || 'superadmin@nexo.com',
                    full_name: 'Super Admin',
                    role: 'super-admin',
                    is_active: true
                }
            }
        });
    },
    logout: () => Promise.resolve({ message: 'Logged out' }),
    getProfile: () => Promise.resolve({
        data: {
            id: 'mock-user-1',
            email: 'admin@nexo.com',
            full_name: 'Super Admin',
            role: 'super-admin'
        }
    }),
    updateProfile: (data) => api.put(`${AUTH}/profile`, data),
    changePassword: (data) => api.post(`${AUTH}/change-password`, data),
    forgotPassword: (email) => api.post(`${AUTH}/forgot-password`, { email }),
    resetPassword: (reset_token, new_password) => api.post(`${AUTH}/reset-password`, { reset_token, new_password }),
    refreshToken: (refresh_token) => api.post(`${AUTH}/refresh-token`, { refresh_token }),
};
