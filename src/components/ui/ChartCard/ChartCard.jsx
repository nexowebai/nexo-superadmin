import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, MoreVertical } from 'lucide-react';
import { cn } from '@lib/cn';
import { useTheme } from '@context';
import TimeRangeSelector from '@components/ui/TimeRangeSelector';
import './ChartCard.css';

const getChartColors = (isDark) => {
    // Get chart theme from localStorage
    const chartTheme = localStorage.getItem('ds-chart-theme') || 'default';
    
    // Chart theme palettes
    const themes = {
        default: {
            dark: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            light: ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed']
        },
        pastel: {
            dark: ['#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#c4b5fd'],
            light: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa']
        },
        ocean: {
            dark: ['#0ea5e9', '#06b6d4', '#2dd4bf', '#38bdf8', '#7dd3fc'],
            light: ['#0284c7', '#0891b2', '#14b8a6', '#0ea5e9', '#38bdf8']
        }
    };

    const selectedTheme = themes[chartTheme] || themes.default;
    const colors = isDark ? selectedTheme.dark : selectedTheme.light;

    return {
        primary: colors,
        success: isDark ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'] : ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'],
        warning: isDark ? ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'] : ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
        error: isDark ? ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'] : ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
        info: isDark ? ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'] : ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    };
};

function ChartCard({
    title,
    subtitle,
    data = [],
    type = 'line', // line, bar, area, pie
    dataKey,
    xAxisKey = 'date',
    colorScheme = 'primary',
    showTimeRange = true,
    showTrend = true,
    showLegend = false,
    height = 300,
    className,
    onTimeRangeChange,
    actions,
    loading = false,
    emptyMessage = 'No data available',
}) {
    const [timeRange, setTimeRange] = useState(30);
    const { isDark } = useTheme();

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        onTimeRangeChange?.(range);
    };

    // Calculate trend
    const trend = useMemo(() => {
        if (!showTrend || !data || data.length < 2) return null;

        const values = data.map(d => d[dataKey] || 0);
        const firstValue = values[0];
        const lastValue = values[values.length - 1];

        if (firstValue === 0) return null;

        const change = ((lastValue - firstValue) / firstValue) * 100;
        const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

        return {
            value: Math.abs(change).toFixed(1),
            direction,
            icon: direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus,
        };
    }, [data, dataKey, showTrend]);

    const CHART_COLORS = useMemo(() => getChartColors(isDark), [isDark]);
    const colors = CHART_COLORS[colorScheme] || CHART_COLORS.primary;

    const renderChart = () => {
        if (loading) {
            return (
                <div className="chart-card__loading">
                    <div className="chart-card__skeleton" />
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="chart-card__empty">
                    <p>{emptyMessage}</p>
                </div>
            );
        }

        const commonProps = {
            data,
            margin: { top: 10, right: 10, left: 0, bottom: 0 },
        };

        switch (type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-base)" opacity={0.3} />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="var(--ds-text-tertiary)"
                                fontSize={12}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="var(--ds-text-tertiary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--ds-surface-2)',
                                    border: '1px solid var(--ds-border-base)',
                                    borderRadius: 'var(--ds-radius-md)',
                                    fontSize: '12px',
                                }}
                            />
                            {showLegend && <Legend />}
                            <Bar dataKey={dataKey} fill={colors[0]} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <AreaChart {...commonProps}>
                            <defs>
                                <linearGradient id={`gradient-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-base)" opacity={0.3} />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="var(--ds-text-tertiary)"
                                fontSize={12}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="var(--ds-text-tertiary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--ds-surface-2)',
                                    border: '1px solid var(--ds-border-base)',
                                    borderRadius: 'var(--ds-radius-md)',
                                    fontSize: '12px',
                                }}
                            />
                            {showLegend && <Legend />}
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={colors[0]}
                                strokeWidth={2}
                                fill={`url(#gradient-${colorScheme})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.name}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey={dataKey}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--ds-surface-2)',
                                    border: '1px solid var(--ds-border-base)',
                                    borderRadius: 'var(--ds-radius-md)',
                                    fontSize: '12px',
                                }}
                            />
                            {showLegend && <Legend />}
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'line':
            default:
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <LineChart {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-base)" opacity={0.3} />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="var(--ds-text-tertiary)"
                                fontSize={12}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="var(--ds-text-tertiary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--ds-surface-2)',
                                    border: '1px solid var(--ds-border-base)',
                                    borderRadius: 'var(--ds-radius-md)',
                                    fontSize: '12px',
                                }}
                            />
                            {showLegend && <Legend />}
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={colors[0]}
                                strokeWidth={2}
                                dot={{ fill: colors[0], r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <motion.div
            className={cn('chart-card', className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="chart-card__header">
                <div className="chart-card__title-section">
                    <h3 className="chart-card__title">{title}</h3>
                    {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
                </div>

                <div className="chart-card__controls">
                    {trend && (
                        <div className={cn('chart-card__trend', `chart-card__trend--${trend.direction}`)}>
                            <trend.icon size={16} />
                            <span>{trend.value}%</span>
                        </div>
                    )}

                    {showTimeRange && (
                        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
                    )}

                    {actions && <div className="chart-card__actions">{actions}</div>}
                </div>
            </div>

            <div className="chart-card__body">{renderChart()}</div>
        </motion.div>
    );
}

export default ChartCard;
