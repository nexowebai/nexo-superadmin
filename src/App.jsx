import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@lib/queryClient';
import { ThemeProvider, useTheme } from '@context/ThemeContext';
import { AuthProvider, useAuth } from '@context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LayoutProvider } from '@context';
import AppRoutes from '@/routes';
import '@styles/index.css';

function SessionExpiredListener() {
    const { logout } = useAuth();
    useEffect(() => {
        const handleSessionExpired = (event) => {
            console.warn('Session expired:', event.detail?.message);
            logout();
            window.location.href = '/login?session=expired';
        };
        window.addEventListener('session-expired', handleSessionExpired);
        return () => window.removeEventListener('session-expired', handleSessionExpired);
    }, [logout]);
    return null;
}

function ThemedToaster() {
    const { theme } = useTheme();
    return (
        <Toaster
            theme={theme}
            position="top-right"
            expand={true}
            richColors
            closeButton
            duration={4000}
            toastOptions={{
                className: 'nx-toast',
                style: {
                    fontFamily: 'var(--nx-font-sans)',
                    borderRadius: 'var(--nx-radius-lg)',
                },
            }}
        />
    );
}

function GlobalAppLoader() {
    const { loading } = useAuth();
    const isAuthPage = window.location.pathname.match(/^\/(login|forgot-password|reset-password|set-password)/);

    if (!loading || isAuthPage) return null;

    return (
        <div className="app-loader">
            <div className="app-loader__spinner"></div>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <NotificationProvider>
                        <LayoutProvider>
                            <SessionExpiredListener />
                            <GlobalAppLoader />
                            <AppRoutes />
                            <ThemedToaster />
                        </LayoutProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
