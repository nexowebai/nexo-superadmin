import React from "react";
import { BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Select } from "@components/ui";
import { PLAN_DISTRIBUTION } from "../constants/paymentData";

export function SubscriptionDensityChart({ usageView, setUsageView }) {
  return (
    <div className="card-pro p-6 bg-surface border border-base rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <BarChart2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-primary m-0">Subscription Density</h3>
            <p className="text-xs text-muted mt-0.5 m-0 font-medium">
              Extra resource allocation metrics
            </p>
          </div>
        </div>
        <Select
          options={[
            { label: "Usage vs Limit", value: "usage" },
            { label: "Extra Costs", value: "extra" },
          ]}
          value={usageView}
          onChange={setUsageView}
          className="w-48"
        />
      </div>
      <div style={{ height: 260, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={PLAN_DISTRIBUTION}
            margin={{ top: 25, right: 10, left: 0, bottom: 0 }}
          >
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
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--bg-surface)",
                borderRadius: "8px",
                border: "1px solid var(--border-base)",
                boxShadow: "var(--shadow-lg)",
              }}
              cursor={{ fill: "var(--bg-elevated)", opacity: 0.4 }}
            />
            <Bar
              dataKey={usageView === "usage" ? "baseLimit" : "extraCost"}
              name={
                usageView === "usage" ? "Allowed Projects" : "Extra Revenue"
              }
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              barSize={28}
            >
              <LabelList 
                dataKey={usageView === "usage" ? "baseLimit" : "extraCost"} 
                position="top" 
                fill="var(--text-muted)"
                fontSize={10}
                fontWeight={700}
                offset={10}
              />
            </Bar>
            <Bar
              dataKey={usageView === "usage" ? "avgUsage" : "extraCost"}
              name={usageView === "usage" ? "Avg Project Usage" : "Extra Usage"}
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              barSize={28}
            >
              <LabelList 
                dataKey={usageView === "usage" ? "avgUsage" : "extraCost"} 
                position="top" 
                fill="var(--primary)"
                fontSize={10}
                fontWeight={900}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
