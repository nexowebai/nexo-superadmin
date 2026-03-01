import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = {
    green: {
        name: 'Green',
        dark: {
            primary: '#10b981',
            primaryHover: '#059669',
            primaryRgb: '16, 185, 129',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        light: {
            primary: '#059669',
            primaryHover: '#047857',
            primaryRgb: '5, 150, 105',
            success: '#059669',
            warning: '#ea580c',
            error: '#dc2626',
            info: '#0284c7',
        },
    },
    blue: {
        name: 'Blue',
        dark: {
            primary: '#3b82f6',
            primaryHover: '#2563eb',
            primaryRgb: '59, 130, 246',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        light: {
            primary: '#2563eb',
            primaryHover: '#1d4ed8',
            primaryRgb: '37, 99, 235',
            success: '#059669',
            warning: '#ea580c',
            error: '#dc2626',
            info: '#0284c7',
        },
    },
    purple: {
        name: 'Purple',
        dark: {
            primary: '#8b5cf6',
            primaryHover: '#7c3aed',
            primaryRgb: '139, 92, 246',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        light: {
            primary: '#7c3aed',
            primaryHover: '#6d28d9',
            primaryRgb: '124, 58, 237',
            success: '#059669',
            warning: '#ea580c',
            error: '#dc2626',
            info: '#0284c7',
        },
    },
    orange: {
        name: 'Orange',
        dark: {
            primary: '#f59e0b',
            primaryHover: '#d97706',
            primaryRgb: '245, 158, 11',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        light: {
            primary: '#ea580c',
            primaryHover: '#c2410c',
            primaryRgb: '234, 88, 12',
            success: '#059669',
            warning: '#ea580c',
            error: '#dc2626',
            info: '#0284c7',
        },
    },
    pink: {
        name: 'Pink',
        dark: {
            primary: '#ec4899',
            primaryHover: '#db2777',
            primaryRgb: '236, 72, 153',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        light: {
            primary: '#db2777',
            primaryHover: '#be185d',
            primaryRgb: '219, 39, 119',
            success: '#059669',
            warning: '#ea580c',
            error: '#dc2626',
            info: '#0284c7',
        },
    },
};

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('theme-mode');
        return saved || 'dark';
    });

    const [color, setColor] = useState(() => {
        const saved = localStorage.getItem('theme-color');
        return saved || 'green';
    });

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(mode === 'light' ? 'light-mode' : 'dark-mode');

        const theme = THEMES[color];
        if (theme) {
            const themeColors = mode === 'dark' ? theme.dark : theme.light;
            
            // Primary colors
            root.style.setProperty('--primary', themeColors.primary);
            root.style.setProperty('--primary-hover', themeColors.primaryHover);
            root.style.setProperty('--primary-rgb', themeColors.primaryRgb);
            
            // Sidebar colors
            root.style.setProperty('--sidebar-text-active', themeColors.primary);
            root.style.setProperty('--sidebar-hover', `rgba(${themeColors.primaryRgb}, 0.08)`);
            root.style.setProperty('--sidebar-active', `rgba(${themeColors.primaryRgb}, ${mode === 'dark' ? '0.15' : '0.12'})`);
            
            // Semantic colors
            root.style.setProperty('--success', themeColors.success);
            root.style.setProperty('--warning', themeColors.warning);
            root.style.setProperty('--error', themeColors.error);
            root.style.setProperty('--info', themeColors.info);
            
            // Soft variants
            const successRgb = mode === 'dark' ? '16, 185, 129' : '5, 150, 105';
            const warningRgb = mode === 'dark' ? '245, 158, 11' : '234, 88, 12';
            const errorRgb = mode === 'dark' ? '239, 68, 68' : '220, 38, 38';
            const infoRgb = mode === 'dark' ? '59, 130, 246' : '2, 132, 199';
            
            root.style.setProperty('--success-soft', `rgba(${successRgb}, ${mode === 'dark' ? '0.1' : '0.12'})`);
            root.style.setProperty('--warning-soft', `rgba(${warningRgb}, ${mode === 'dark' ? '0.1' : '0.12'})`);
            root.style.setProperty('--error-soft', `rgba(${errorRgb}, ${mode === 'dark' ? '0.1' : '0.12'})`);
            root.style.setProperty('--info-soft', `rgba(${infoRgb}, ${mode === 'dark' ? '0.1' : '0.12'})`);
        }

        localStorage.setItem('theme-mode', mode);
        localStorage.setItem('theme-color', color);
    }, [mode, color]);

    const toggleMode = () => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setThemeColor = (newColor) => {
        if (THEMES[newColor]) {
            setColor(newColor);
        }
    };

    const value = {
        mode,
        color,
        theme: mode,
        themes: THEMES,
        toggleMode,
        setThemeColor,
        isDark: mode === 'dark',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
