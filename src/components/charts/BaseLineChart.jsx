import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedLabel =
      label instanceof Date
        ? label.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : label;

    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">
          {formattedLabel}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {entry.name}
                </span>
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const BaseLineChart = ({
  data,
  lines = [],
  height = 340,
  margin = { top: 10, right: 30, left: 10, bottom: 0 },
}) => {
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={margin}>
          <defs>
            {lines.map((line, i) => (
              <linearGradient
                key={i}
                id={`color-${line.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={line.color} stopOpacity={0.1} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border-base)"
            opacity={0.6}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })
            }
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{
              stroke: "var(--primary)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          {lines.map((line, i) => (
            <Area
              key={i}
              type="monotone"
              name={line.name}
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 3}
              fillOpacity={1}
              fill={`url(#color-${line.dataKey})`}
              dot={{ r: 4, strokeWidth: 2, fill: "var(--bg-surface)" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: line.color }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BaseLineChart;
