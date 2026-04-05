import { APP_CONFIG } from '../config/app';

const { storage } = APP_CONFIG;

export const sessionService = {
    getAccessToken: () => {
        const token = localStorage.getItem(storage.accessToken);
        if (!token) return null;
        return token.replace(/^"(.*)"$/, '$1');
    },

    getUser: () => {
        try {
            const user = localStorage.getItem(storage.user);
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    setAuthData: (data) => {
        const { access_token, user, expires_in } = data;

        if (access_token) {
            localStorage.setItem(storage.accessToken, access_token);
            if (expires_in) {
                const expiryTime = Date.now() + (expires_in * 1000);
                localStorage.setItem(storage.tokenExpiry, expiryTime.toString());
            }
        }
        if (user) {
            localStorage.setItem(storage.user, JSON.stringify(user));
        }
    },

    clearAuthData: () => {
        localStorage.removeItem(storage.accessToken);
        localStorage.removeItem(storage.user);
        localStorage.removeItem(storage.tokenExpiry);
        localStorage.removeItem(storage.refreshToken);
    },

    isTokenValid: () => {
        return !!sessionService.getAccessToken();
    },

    handleSessionExpired: (toast) => {
        sessionService.clearAuthData();
        if (toast) toast.warning('Session expired. Please login again.');
        setTimeout(() => {
            window.location.href = '/login?session=expired';
        }, 100);
    }
};

export default sessionService;
