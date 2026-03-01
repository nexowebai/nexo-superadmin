export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'ds_access_token',
    REFRESH_TOKEN: 'ds_refresh_token',
    USER: 'ds_user',
    THEME: 'ds_theme',
};

export const TOKEN_EXPIRY_KEY = 'ds_token_expiry';
