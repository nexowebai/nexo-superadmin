import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const ChartLayout = ({ children, height }) => (
  <ResponsiveContainer width="100%" height={height}>
    {children}
  </ResponsiveContainer>
);

const commonTooltip = {
  contentStyle: {
    backgroundColor: "var(--ds-surface-2)",
    border: "1px solid var(--ds-border-base)",
    borderRadius: "var(--ds-radius-md)",
    fontSize: "12px",
  }
};

export const BarChartPart = ({ data, xAxisKey, dataKey, colors, showLegend, height }) => (
  <ChartLayout height={height}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-base)" opacity={0.3} />
      <XAxis dataKey={xAxisKey} stroke="var(--ds-text-tertiary)" fontSize={12} tickLine={false} />
      <YAxis stroke="var(--ds-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip {...commonTooltip} />
      {showLegend && <Legend />}
      <Bar dataKey={dataKey} fill={colors[0]} radius={[6, 6, 0, 0]} />
    </BarChart>
  </ChartLayout>
);

export const AreaChartPart = ({ data, xAxisKey, dataKey, colors, showLegend, colorScheme, height }) => (
  <ChartLayout height={height}>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`gradient-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
          <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-base)" opacity={0.3} />
      <XAxis dataKey={xAxisKey} stroke="var(--ds-text-tertiary)" fontSize={12} tickLine={false} />
      <YAxis stroke="var(--ds-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip {...commonTooltip} />
      {showLegend && <Legend />}
      <Area type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} fill={`url(#gradient-${colorScheme})`} />
    </AreaChart>
  </ChartLayout>
);

export const LineChartPart = ({ data, xAxisKey, dataKey, colors, showLegend, height }) => (
  <ChartLayout height={height}>
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-base)" opacity={0.3} />
      <XAxis dataKey={xAxisKey} stroke="var(--ds-text-tertiary)" fontSize={12} tickLine={false} />
      <YAxis stroke="var(--ds-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip {...commonTooltip} />
      {showLegend && <Legend />}
      <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={{ fill: colors[0], r: 4 }} activeDot={{ r: 6 }} />
    </LineChart>
  </ChartLayout>
);

export const PieChartPart = ({ data, dataKey, colors, showLegend, height }) => (
  <ChartLayout height={height}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} dataKey={dataKey}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip {...commonTooltip} />
      {showLegend && <Legend />}
    </PieChart>
  </ChartLayout>
);
