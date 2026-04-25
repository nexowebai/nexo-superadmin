import React, { useState } from "react";
import { Activity, ArrowUpRight, TrendingDown } from "lucide-react";
import { Card, DateRangePicker } from "@components/ui";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { BaseLineChart, BaseBarChart, ChartToggle } from "@components/charts";
import { useRevenueAnalysis } from "../hooks/useRevenueAnalysis";

export default function FinancialPerformance({ loading }) {
  const { dateRange, setDateRange, chartData, stats } = useRevenueAnalysis();
  const [chartType, setChartType] = useState("line");

  if (loading)
    return (
      <Card variant="nx" padding="none" className="h-[480px] overflow-hidden">
        <Skeleton variant="rect" width="100%" height="100%" />
      </Card>
    );

  const linesConfig = [
    { name: "Revenue", dataKey: "revenue", color: "var(--primary)" },
    { name: "Costs", dataKey: "costs", color: "var(--info)" },
  ];

  const barsConfig = [
    { name: "Revenue", dataKey: "revenue", color: "var(--primary)" },
    { name: "Costs", dataKey: "costs", color: "var(--info)" },
  ];

  return (
    <Card
      variant="nx"
      padding="none"
      className="overflow-visible flex flex-col h-full"
    >
      {/* Header Section */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-base bg-subtle/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary-soft shadow-inner">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight leading-none mb-1.5">
              Capital Analytics
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ChartToggle value={chartType} onChange={setChartType} />
          <div className="h-8 w-px bg-border-base mx-1" />
          <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            onChange={setDateRange}
            className="w-[280px]"
            align="end"
          />
        </div>
      </div>

      {/* Primary Metrics Strip */}
      <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-base bg-subtle/10">
        <div className="flex items-center gap-12">
          {/* Revenue Metric */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dimmed mb-3 flex items-center gap-2">
              Net Performance
            </span>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none">
                {stats.totalEarnings}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-success-soft text-[10px] font-black text-success border border-success-soft">
                <ArrowUpRight size={14} strokeWidth={3} />
                {stats.earningsTrend}
              </div>
            </div>
          </div>

          <div className="w-px h-12 bg-border-base" />

          {/* Costs Metric */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dimmed mb-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-info" />
              Resource Burn
            </span>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none">
                {stats.totalCosts}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-subtle text-[10px] font-black text-secondary border border-base">
                <TrendingDown size={14} className="text-info" />
                Optimal
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--primary)] shadow-sm" />
            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">
              Revenue Stream
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--info)] shadow-sm" />
            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">
              Burn Rate
            </span>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 px-4 pt-8 pb-4 min-h-[360px]">
        {chartType === "line" ? (
          <BaseLineChart data={chartData} lines={linesConfig} height={360} />
        ) : (
          <BaseBarChart data={chartData} bars={barsConfig} height={360} />
        )}
      </div>
    </Card>
  );
}
