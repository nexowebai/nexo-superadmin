import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@lib/cn";
import { motion } from "framer-motion";
import "./StatCard.css";

function StatCard({
  title,
  value,
  change,
  changeType = "percentage",
  icon: Icon,
  iconColor = "primary",
  trend,
  loading = false,
  className,
  onClick,
}) {
  const formatChange = () => {
    if (change === undefined || change === null) return null;
    const prefix = change > 0 ? "+" : "";
    const suffix = changeType === "percentage" ? "%" : "";
    return `${prefix}${change}${suffix}`;
  };

  if (loading) {
    return (
      <div className={cn("stat-card stat-card--loading", className)}>
        <div className="stat-card__main">
          <div className="stat-card__skeleton-icon" />
          <div className="stat-card__skeleton-content">
            <div className="stat-card__skeleton-title" />
            <div className="stat-card__skeleton-value" />
          </div>
        </div>
        <div className="stat-card__footer">
          <div className="stat-card__skeleton-footer" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("stat-card", onClick && "stat-card--clickable", className)}
      onClick={onClick}
    >
      <div className="stat-card__glow" />
      <div className="stat-card__main">
        {Icon && (
          <div
            className={cn("stat-card__icon", `stat-card__icon--${iconColor}`)}
          >
            <Icon size={22} strokeWidth={2.5} />
          </div>
        )}
        <div className="stat-card__content">
          <p className="stat-card__title">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="stat-card__value">{value}</h3>
          </div>
        </div>
      </div>

      <div className="stat-card__visual">
        {/* Subtle decorative wave for the premium feel */}
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="stat-card__sparkline">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M0 25 C 20 25, 30 5, 50 15 S 80 0, 100 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {(trend || change !== undefined) && (
        <div
          className={cn(
            "stat-card__footer",
            trend && `stat-card__footer--${trend}`,
          )}
        >
          <div className="flex items-center gap-1.5">
            {trend && (
              <span className="stat-card__trend-icon">
                {trend === "up" && <TrendingUp size={14} />}
                {trend === "down" && <TrendingDown size={14} />}
                {trend === "neutral" && <Minus size={14} />}
              </span>
            )}
            {change !== undefined && (
              <span className="stat-card__change-value">{formatChange()}</span>
            )}
          </div>
          <span className="stat-card__period">from last month</span>
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;
