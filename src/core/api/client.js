import axios from 'axios';
import { toast } from 'sonner';
import { APP_CONFIG } from '../config/app';
import { sessionService } from '../auth/sessionService';

const { baseUrl, timeout } = APP_CONFIG.api;

const apiClient = axios.create({
    baseURL: `${baseUrl}/api`,
    timeout: timeout,
    headers: { 'Content-Type': 'application/json' },
});

let isRedirecting = false;

apiClient.interceptors.request.use(
    (config) => {
        const token = sessionService.getAccessToken();
        const isLogin = config.url?.includes('/login');

        if (token && !isLogin) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const errorData = error.response?.data;
        const errorMessage = errorData?.error?.message || errorData?.message || '';

        if (
            errorMessage.toLowerCase().includes('invalid token') ||
            errorMessage.toLowerCase().includes('token expired') ||
            errorMessage.toLowerCase().includes('jwt expired') ||
            error.response?.status === 401
        ) {
            const isLoginRequest = error.config?.url?.includes('/login');
            const token = sessionService.getAccessToken();

            if (token && (token.includes('mock') || token.startsWith('sb_'))) {
                console.warn('Suppressing 401 for mock/preview token');
                return Promise.reject(errorData || error);
            }

            if (!isLoginRequest && token && !isRedirecting) {
                isRedirecting = true;
                sessionService.handleSessionExpired(toast);
                return Promise.reject({ handled: true, message: 'Session expired' });
            }
        }

        return Promise.reject(errorData || error);
    }
);

export default apiClient;
