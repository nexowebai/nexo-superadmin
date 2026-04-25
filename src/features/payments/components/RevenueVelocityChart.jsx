import React from "react";
import { Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Select } from "@components/ui";
import { REVENUE_DATA } from "../constants/paymentData";

export function RevenueVelocityChart({ chartView, setChartView }) {
  return (
    <div className="card-pro p-6 bg-surface border border-base rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-bold text-primary m-0">Revenue Velocity</h3>
            <p className="text-xs text-muted mt-0.5 m-0 font-medium">
              Monthly revenue vs expenses
            </p>
          </div>
        </div>
        <Select
          options={[
            { label: "Revenue & Costs", value: "revenue" },
            { label: "Net Profit", value: "profit" },
          ]}
          value={chartView}
          onChange={setChartView}
          className="w-48"
        />
      </div>
      <div style={{ height: 260, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={REVENUE_DATA}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.15}
                />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--error)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--error)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border-base)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 11,
                fontWeight: 700,
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 11,
                fontWeight: 700,
              }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--bg-surface)",
                borderRadius: "8px",
                border: "1px solid var(--border-base)",
                color: "var(--text-primary)",
                boxShadow: "var(--shadow-lg)",
              }}
              cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "var(--bg-surface)",
                stroke: "var(--primary)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "var(--primary)",
                stroke: "var(--bg-surface)",
                strokeWidth: 2,
              }}
              fillOpacity={1}
              fill="url(#colorRev)"
            />
            {chartView === "revenue" && (
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="var(--error)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "var(--bg-surface)",
                  stroke: "var(--error)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "var(--error)",
                  stroke: "var(--bg-surface)",
                  strokeWidth: 2,
                }}
                fillOpacity={1}
                fill="url(#colorExp)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
