import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('theme-mode');
        return saved || 'light';
    });

    const [color, setColor] = useState('green');

    useEffect(() => {
        const body = document.body;

        // Manage Dark/Light Mode
        body.classList.remove('light-mode', 'dark-mode');
        if (mode === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.add('light-mode');
        }

        // Manage Theme Color via Classes
        const colorClasses = ['theme-green'];
        body.classList.remove(...colorClasses);
        body.classList.add(`theme-${color}`);

        localStorage.setItem('theme-mode', mode);
        localStorage.setItem('theme-color', color);
    }, [mode, color]);

    const toggleMode = () => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newMode) => {
        setMode(newMode);
    };

    const setThemeColor = (newColor) => {
        setColor(newColor);
    };

    const value = {
        mode,
        color,
        theme: mode,
        setTheme,
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
