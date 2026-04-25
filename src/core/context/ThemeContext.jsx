import { createContext, useContext, useState, useEffect } from "react";
import { APP_THEMES } from "../../constants/themePalettes";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved || "light";
  });

  const [colorId, setColorId] = useState(() => {
    const saved = localStorage.getItem("theme-color");
    return saved || "emerald";
  });

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    // Manage Dark/Light Mode
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(`${mode}-mode`);

    // Manage Theme Semantic Palette
    const theme = APP_THEMES.find((t) => t.id === colorId) || APP_THEMES[0];
    const [primary, success, info, warning, error] = theme.colors;

    const setVar = (name, val) => root.style.setProperty(name, val);
    
    setVar("--primary", primary);
    setVar("--success", success);
    setVar("--info", info);
    setVar("--warning", warning);
    setVar("--error", error);

    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-color", colorId);
  }, [mode, colorId]);

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newMode) => {
    setMode(newMode);
  };

  const setThemeColor = (newId) => {
    setColorId(newId);
  };

  const value = {
    mode,
    color: colorId,
    theme: mode,
    setTheme,
    toggleMode,
    setThemeColor,
    isDark: mode === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
