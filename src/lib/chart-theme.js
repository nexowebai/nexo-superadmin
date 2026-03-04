/*
 * Chart Theme Configuration
 * Dynamic colors based on current theme
 */

const getCSSVar = (name) => {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

export const getChartColors = () => ({
    primary: getCSSVar('--primary') || '#10b981',
    secondary: getCSSVar('--info') || '#3b82f6',
    tertiary: getCSSVar('--ds-chart-3') || '#06b6d4',
    success: getCSSVar('--success') || '#10b981',
    warning: getCSSVar('--warning') || '#f59e0b',
    accent: getCSSVar('--primary-hover') || '#059669',
    teal: getCSSVar('--ds-chart-7') || '#14b8a6',
    orange: getCSSVar('--ds-chart-8') || '#f97316',
});

export const getChartPalette = () => [
    getCSSVar('--primary') || '#10b981',
    getCSSVar('--info') || '#3b82f6',
    getCSSVar('--warning') || '#f59e0b',
    getCSSVar('--success') || '#10b981',
    getCSSVar('--ds-chart-5') || '#f59e0b',
    getCSSVar('--ds-chart-6') || '#ec4899',
    getCSSVar('--ds-chart-7') || '#14b8a6',
    getCSSVar('--ds-chart-8') || '#f97316',
];

export const getChartTheme = () => ({
    background: getCSSVar('--ds-card-bg') || '#0f0f12',
    textColor: getCSSVar('--ds-text-secondary') || '#a1a1aa',
    gridColor: getCSSVar('--ds-border-base') || 'rgba(255, 255, 255, 0.06)',
    axisColor: getCSSVar('--ds-text-muted') || '#71717a',
    tooltipBg: getCSSVar('--ds-bg-overlay') || '#1f1f23',
    tooltipBorder: getCSSVar('--ds-border-strong') || 'rgba(255, 255, 255, 0.12)',
});

export const chartConfig = {
    margin: { top: 20, right: 20, bottom: 20, left: 20 },

    grid: {
        stroke: 'var(--ds-border-base)',
        strokeDasharray: '4 4',
        strokeOpacity: 0.6,
    },

    axis: {
        stroke: 'var(--ds-text-muted)',
        fontSize: 12,
        fontFamily: 'var(--ds-font-sans)',
        tickLine: false,
        axisLine: false,
    },

    tooltip: {
        contentStyle: {
            backgroundColor: 'var(--ds-bg-overlay)',
            border: '1px solid var(--ds-border-strong)',
            borderRadius: 'var(--ds-radius-lg)',
            boxShadow: 'var(--ds-shadow-lg)',
            padding: '12px 16px',
            fontSize: '13px',
            fontFamily: 'var(--ds-font-sans)',
            color: 'var(--ds-text-primary)',
        },
        cursor: {
            stroke: 'var(--ds-brand-500)',
            strokeWidth: 1,
            strokeDasharray: '4 4',
        },
        labelStyle: {
            color: 'var(--ds-text-secondary)',
            fontWeight: 500,
            marginBottom: '4px',
        },
    },

    legend: {
        wrapperStyle: {
            fontSize: '13px',
            fontFamily: 'var(--ds-font-sans)',
            color: 'var(--ds-text-secondary)',
        },
    },
};

export const areaChartGradient = (id, color) => ({
    id,
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '1',
    stops: [
        { offset: '5%', stopColor: color, stopOpacity: 0.3 },
        { offset: '95%', stopColor: color, stopOpacity: 0 },
    ],
});
