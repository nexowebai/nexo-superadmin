import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
                  style={{ backgroundColor: entry.color || entry.fill }} /* allowed-inline */
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

const BaseBarChart = ({
  data,
  bars = [],
  height = 340,
  margin = { top: 10, right: 30, left: 10, bottom: 0 },
  barGap = 8,
}) => {
  return (
    <div style={{ height: `${height}px`, width: "100%" }} /* allowed-inline */>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={margin} barGap={barGap}>
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
            cursor={{ fill: "var(--primary-soft)", opacity: 0.4 }}
          />
          {bars.map((bar, i) => (
            <Bar
              key={i}
              name={bar.name}
              dataKey={bar.dataKey}
              fill={bar.color}
              radius={[2, 2, 0, 0]}
              barSize={14}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BaseBarChart;
