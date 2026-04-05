import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@lib/cn";
import { useTheme } from "@context";
import { getChartColors } from "@utils/chartUtils";
import TimeRangeSelector from "@components/ui/TimeRangeSelector";
import { LineChartPart, BarChartPart, AreaChartPart, PieChartPart } from "./components/ChartParts";
import "./ChartCard.css";

const ChartCardSkeleton = () => <div className="chart-card__loading"><div className="chart-card__skeleton" /></div>;
const ChartEmptyState = ({ message }) => <div className="chart-card__empty"><p>{message}</p></div>;

function ChartCard({
  title, subtitle, data = [], type = "line", dataKey, xAxisKey = "date",
  colorScheme = "primary", showTimeRange = true, showTrend = true,
  showLegend = false, height = 300, className, onTimeRangeChange, actions,
  loading = false, emptyMessage = "No data available",
}) {
  const [timeRange, setTimeRange] = useState(30);
  const { isDark } = useTheme();

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const trend = useMemo(() => {
    if (!showTrend || !data || data.length < 2) return null;
    const values = data.map(d => d[dataKey] || 0);
    const [first, last] = [values[0], values[values.length - 1]];
    if (first === 0) return null;
    const change = ((last - first) / first) * 100;
    const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral";
    return {
      value: Math.abs(change).toFixed(1),
      direction,
      icon: direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus
    };
  }, [data, dataKey, showTrend]);

  const colors = useMemo(() => {
    const palette = getChartColors(isDark);
    return palette[colorScheme] || palette.primary;
  }, [isDark, colorScheme]);

  const renderChart = () => {
    if (loading) return <ChartCardSkeleton />;
    if (!data?.length) return <ChartEmptyState message={emptyMessage} />;

    const props = { data, xAxisKey, dataKey, colors, showLegend, colorScheme, height };
    switch (type) {
      case "bar": return <BarChartPart {...props} />;
      case "area": return <AreaChartPart {...props} />;
      case "pie": return <PieChartPart {...props} />;
      default: return <LineChartPart {...props} />;
    }
  };

  return (
    <motion.div className={cn("chart-card", className)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="chart-card__header">
        <div className="chart-card__title-section">
          <h3 className="chart-card__title">{title}</h3>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </div>
        <div className="chart-card__controls">
          {trend && (
            <div className={cn("chart-card__trend", `chart-card__trend--${trend.direction}`)}>
              <trend.icon size={16} /><span>{trend.value}%</span>
            </div>
          )}
          {showTimeRange && <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />}
          {actions && <div className="chart-card__actions">{actions}</div>}
        </div>
      </div>
      <div className="chart-card__body">{renderChart()}</div>
    </motion.div>
  );
}

export default ChartCard;
