import React from "react";
import { Activity, ArrowUpRight } from "lucide-react";
import { DatePicker, Card } from "@components/ui";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import {
  AreaChart,
  Area,
  Grid,
  XAxis,
  YAxis,
  ChartTooltip,
} from "@/components/ui/AreaChart";
import { useRevenueAnalysis } from "../hooks/useRevenueAnalysis";

export default function FinancialPerformance({ loading }) {
  const { selectedDate, setSelectedDate, chartData, stats } =
    useRevenueAnalysis();

  if (loading)
    return (
      <Card variant="pro" className="financial-performance-skeleton h-[480px]">
        <Skeleton variant="rect" width="100%" height="100%" />
      </Card>
    );

  return (
    <Card variant="pro" padding="lg" className="financial-performance-card">
      <div className="financial-header">
        <div className="financial-header__info">
          <div className="financial-header__icon">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="financial-header__title">Revenue Overview</h3>
            <p className="financial-header__subtitle">
              Track your earnings and trends
            </p>
          </div>
        </div>

        <div className="financial-header__action">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            className="w-[180px]"
          />
        </div>
      </div>

      <div className="financial-stats-row">
        <div className="mini-stat">
          <span className="mini-stat__label">Total Earnings</span>
          <div className="mini-stat__value-wrapper">
            <span className="mini-stat__value">{stats.totalEarnings}</span>
            <div className="mini-stat__trend">
              <ArrowUpRight size={12} />
              <span>{stats.earningsTrend}</span>
            </div>
          </div>
        </div>
        <div className="financial-stats-divider" />
        <div className="mini-stat">
          <span className="mini-stat__label">Total Costs</span>
          <div className="mini-stat__value-wrapper">
            <span className="mini-stat__value">{stats.totalCosts}</span>
            <div className="mini-stat__badge">{stats.costsStatus}</div>
          </div>
        </div>
      </div>

      <div className="financial-chart">
        <AreaChart data={chartData} aspectRatio="3.5 / 1">
          <Grid horizontal vertical={false} strokeOpacity={0.06} />
          <Area
            dataKey="revenue"
            fill="var(--primary)"
            fillOpacity={0.08}
            strokeWidth={2.5}
            fadeEdges
          />
          <Area
            dataKey="costs"
            fill="#38bdf8"
            fillOpacity={0.04}
            strokeWidth={2}
            fadeEdges
          />
          <YAxis
            numTicks={5}
            formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
          />
          <XAxis numTicks={6} />
          <ChartTooltip
            rows={(point) => [
              {
                color: "var(--primary)",
                label: "Revenue",
                value: `$${Math.round(point.revenue).toLocaleString()}`,
              },
              {
                color: "#38bdf8",
                label: "Costs",
                value: `$${Math.round(point.costs).toLocaleString()}`,
              },
            ]}
          />
        </AreaChart>
      </div>

      <div className="financial-legend">
        <div className="legend-item">
          <div className="legend-item__dot is-primary" />
          <span className="legend-item__text">Total Revenue</span>
        </div>
        <div className="legend-item">
          <div className="legend-item__dot is-secondary" />
          <span className="legend-item__text">Operational Costs</span>
        </div>
      </div>
    </Card>
  );
}
