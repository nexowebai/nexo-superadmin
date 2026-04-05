export const APP_CONFIG = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
        timeout: 30000,
    },
    storage: {
        accessToken: 'ds_access_token',
        refreshToken: 'ds_refresh_token',
        tokenExpiry: 'ds_token_expiry',
        user: 'ds_user',
        theme: 'ds_theme',
    },
};

export default APP_CONFIG;
