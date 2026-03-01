import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '@features/auth/authApi';
import { setAuthData, clearAuthData, getAccessToken, getUser } from '@services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUser());
    const [token, setToken] = useState(getAccessToken());
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback((credentials) => {
        setLoading(true);
        setError(null);

        return authApi.login(credentials)
            .then((response) => {
                const loginData = response?.data || response;
                const accessToken = loginData?.access_token;
                const userData = loginData?.user;
                const expiresIn = loginData?.expires_in;

                if (!accessToken || !userData) {
                    throw new Error('Invalid response from server');
                }

                setAuthData({
                    access_token: accessToken,
                    expires_in: expiresIn,
                    user: userData,
                });

                setUser(userData);
                setToken(accessToken);
                setIsAuthenticated(true);
                setLoading(false);
                return userData;
            })
            .catch((err) => {
                const message = err?.response?.data?.message || err?.message || 'Login failed';
                setError(message);
                setLoading(false);
                throw err;
            });
    }, []);

    const logout = useCallback(() => {
        setLoading(true);
        return authApi.logout()
            .then(() => {
                clearAuthData();
                setUser(null);
                setToken(null);
                setIsAuthenticated(false);
                setLoading(false);
            })
            .catch((err) => {
                console.warn('Logout API error:', err);
                clearAuthData();
                setUser(null);
                setToken(null);
                setIsAuthenticated(false);
                setLoading(false);
            });
    }, []);

    const clearAuthError = useCallback(() => {
        setError(null);
    }, []);

    const updateUser = useCallback((updatedUserData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedUserData };
            // Also persist to localStorage via services
            setAuthData({
                access_token: token,
                user: newUser,
            });
            return newUser;
        });
    }, [token]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            loading,
            error,
            login,
            logout,
            updateUser,
            clearAuthError
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
