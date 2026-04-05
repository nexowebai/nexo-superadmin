import { createContext, useContext } from "react";

export const chartCssVars = {
  background: "var(--chart-background, #ffffff)",
  foreground: "var(--chart-foreground, #000000)",
  foregroundMuted: "var(--chart-foreground-muted, #9f9f9f)",
  label: "var(--chart-label, #9f9f9f)",
  linePrimary: "var(--chart-line-primary, #10b981)",
  lineSecondary: "var(--chart-line-secondary, #3b82f6)",
  crosshair: "var(--chart-crosshair, #666666)",
  grid: "var(--chart-grid, #e5e7eb)",
  indicatorColor: "var(--chart-indicator-color, #10b981)",
  indicatorSecondaryColor: "var(--chart-indicator-secondary-color, #3b82f6)",
  markerBackground: "var(--chart-marker-background, #ffffff)",
  markerBorder: "var(--chart-marker-border, #e5e7eb)",
  markerForeground: "var(--chart-marker-foreground, #000000)",
  badgeBackground: "var(--chart-marker-badge-background, #111111)",
  badgeForeground: "var(--chart-marker-badge-foreground, #ffffff)",
  segmentBackground: "var(--chart-segment-background, #f3f4f6)",
  segmentLine: "var(--chart-segment-line, #d1d5db)",
};

const ChartContext = createContext(null);

export function ChartProvider({ children, value }) {
  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartProvider.");
  }
  return context;
}
