export const getChartColors = (isDark) => {
  const chartTheme = localStorage.getItem("ds-chart-theme") || "default";

  const themes = {
    default: {
      dark: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4"],
      light: ["#059669", "#2563eb", "#d97706", "#dc2626", "#0891b2"],
    },
    pastel: {
      dark: ["#93c5fd", "#6ee7b7", "#fcd34d", "#fca5a5", "#22d3ee"],
      light: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#06b6d4"],
    },
    ocean: {
      dark: ["#0ea5e9", "#06b6d4", "#2dd4bf", "#38bdf8", "#7dd3fc"],
      light: ["#0284c7", "#0891b2", "#14b8a6", "#0ea5e9", "#38bdf8"],
    },
  };

  const selectedTheme = themes[chartTheme] || themes.default;
  const colors = isDark ? selectedTheme.dark : selectedTheme.light;

  return {
    primary: colors,
    success: isDark
      ? ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]
      : ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"],
    warning: isDark
      ? ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"]
      : ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"],
    error: isDark
      ? ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"]
      : ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca"],
    info: isDark
      ? ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]
      : ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
  };
};
