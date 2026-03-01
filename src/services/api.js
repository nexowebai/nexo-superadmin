import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL, STORAGE_KEYS, TOKEN_EXPIRY_KEY } from '@config/api.config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

export const getAccessToken = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;
    return token.replace(/^"(.*)"$/, '$1');
};

export const getUser = () => {
    try {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const setAuthData = (data) => {
    const { access_token, user } = data;

    if (access_token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);

        if (data.expires_in) {
            const expiryTime = Date.now() + (data.expires_in * 1000);
            localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        }
    }
    if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
};

export const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const isTokenValid = () => {
    return !!getAccessToken();
};

let isRedirecting = false;

const handleSessionExpired = () => {
    if (isRedirecting) return;
    isRedirecting = true;

    clearAuthData();
    toast.warning('Session expired. Please login again.');

    setTimeout(() => {
        window.location.href = '/login?session=expired';
    }, 100);
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        const isLogin = config.url?.includes('/login');

        if (token && !isLogin) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
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
            const token = getAccessToken();

            // Skip session expiry for mock tokens during development
            if (token && (token.includes('mock') || token.startsWith('sb_'))) {
                console.warn('Suppressing 401 for mock/preview token');
                return Promise.reject(errorData || error);
            }

            if (!isLoginRequest && token) {
                handleSessionExpired();
                return Promise.reject({ handled: true, message: 'Session expired' });
            }
        }

        return Promise.reject(errorData || error);
    }
);

export default api;
