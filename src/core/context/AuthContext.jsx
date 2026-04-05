import { createContext, useContext, useState, useCallback } from 'react';
import sessionService from '@session';
import { authService } from '@features/auth/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(sessionService.getUser());
    const [token, setToken] = useState(sessionService.getAccessToken());
    const [isAuthenticated, setIsAuthenticated] = useState(sessionService.isTokenValid());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback((credentials) => {
        setLoading(true);
        setError(null);

        return authService.login(credentials)
            .then((response) => {
                const loginData = response?.data || response;
                const accessToken = loginData?.access_token;
                const userData = loginData?.user;
                const expiresIn = loginData?.expires_in;

                if (!accessToken || !userData) {
                    throw new Error('Invalid response from server');
                }

                sessionService.setAuthData({
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
        return authService.logout()
            .then(() => {
                sessionService.clearAuthData();
                setUser(null);
                setToken(null);
                setIsAuthenticated(false);
                setLoading(false);
            })
            .catch((err) => {
                console.warn('Logout API error:', err);
                sessionService.clearAuthData();
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
            sessionService.setAuthData({
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
