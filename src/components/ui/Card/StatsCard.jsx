import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./Card";
import { Skeleton } from "../Skeleton";
import "./styles/StatsCard.css";

const StatsCard = memo(function StatsCard({
  title,
  value,
  trend,
  icon: Icon,
  color = "var(--primary)",
  loading = false,
  variant = "nx",
  description = "",
  className = "",
}) {
  if (loading) return <StatsCardSkeleton variant={variant} />;

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
            /* allowed-inline */
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

      {trend !== undefined ? (
        <div
          className={`stats-card__trend ${trend >= 0 ? "is-up" : "is-down"}`}
        >
          <div className="stats-card__trend-indicator">
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="stats-card__trend-label">vs last month</span>
        </div>
      ) : description ? (
        <div className="stats-card__trend">
          <span className="stats-card__trend-label font-bold text-slate-400 uppercase tracking-widest text-[9px]">
            {description}
          </span>
        </div>
      ) : null}
    </Card>
  );
});

function StatsCardSkeleton({ variant = "nx" }) {
  return (
    <Card
      variant={variant}
      padding="md"
      className="stats-card stats-card--loading"
    >
      <div className="stats-card__header">
        <Skeleton variant="text" width="60%" height="16px" />
        <Skeleton variant="avatar" width="40px" height="40px" />
      </div>
      <div className="stats-card__value">
        <Skeleton
          variant="text"
          width="45%"
          height="32px"
          /* allowed-inline */
          style={{ marginTop: "12px" }}
        />
      </div>
      <div className="stats-card__trend">
        <Skeleton
          variant="text"
          width="70%"
          height="14px"
          /* allowed-inline */
          style={{ marginTop: "8px" }}
        />
      </div>
    </Card>
  );
}

function StatsGrid({ children, columns, className = "" }) {
  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : {};
  return (
    <div className={`stats-grid ${className}`} /* allowed-inline */ style={gridStyle}>
      {children}
    </div>
  );
}

export default StatsCard;
export { StatsCard, StatsCardSkeleton, StatsGrid };
