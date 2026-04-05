import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardSkeleton } from "./Card";
import "./styles/StatsCard.css";

const StatsCard = memo(function StatsCard({
  title,
  value,
  trend,
  icon: Icon,
  color = "var(--primary)",
  loading = false,
  variant = "nx",
  className = "",
}) {
  if (loading) return <StatsCardSkeleton />;

  return (
    <Card
      variant={variant}
      hover
      padding="md"
      className={`stats-card ${className}`}
    >
      <div className="stats-card__header">
        <span className="stats-card__title">{title}</span>
        {Icon && (
          <div
            className="stats-card__icon"
            style={{
              backgroundColor: `color-mix(in srgb, ${color}, transparent 88%)`,
              color,
            }}
          >
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="stats-card__value">{value}</div>

      {trend !== undefined && (
        <div
          className={`stats-card__trend ${trend >= 0 ? "is-up" : "is-down"}`}
        >
          <div className="stats-card__trend-indicator">
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="stats-card__trend-label">vs last month</span>
        </div>
      )}
    </Card>
  );
});

function StatsCardSkeleton() {
  return (
    <Card variant="nx" padding="md" className="stats-card stats-card--loading">
      <div className="stats-card__header">
        <CardSkeleton width="60%" height="16px" />
        <CardSkeleton variant="circle" width="40px" height="40px" />
      </div>
      <div className="stats-card__value">
        <CardSkeleton width="45%" height="32px" style={{ marginTop: 12 }} />
      </div>
      <div className="stats-card__trend">
        <CardSkeleton width="70%" height="14px" style={{ marginTop: 8 }} />
      </div>
    </Card>
  );
}

function StatsGrid({ children, columns, className = "" }) {
  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : {};
  return (
    <div className={`stats-grid ${className}`} style={gridStyle}>
      {children}
    </div>
  );
}

export default StatsCard;
export { StatsCard, StatsCardSkeleton, StatsGrid };
