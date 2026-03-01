import { motion } from "framer-motion";
import { BarChart3, Activity, TrendingUp } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPie,
    Pie,
    Cell
} from "recharts";
import { CardSkeleton } from "@components/ui/Card/Card";
import { formatNumber } from "@utils/format";

const smooth = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <motion.div
            className="tooltip-pro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
        >
            <div className="tooltip-pro__label">{label}</div>
            {payload.map((entry, i) => (
                <div key={i} className="tooltip-pro__item">
                    <span
                        className="tooltip-pro__dot"
                        style={{ background: entry.color || entry.fill }}
                    />
                    <span>{entry.name}:</span>
                    <strong>{formatNumber(entry.value)}</strong>
                </div>
            ))}
        </motion.div>
    );
}

const DistributionCharts = ({ loading, barData, pieData, colors, isDark, onlyBar, onlyPie }) => {
    return (
        <>
            {(!onlyPie || !onlyBar) && !onlyPie && (
                <motion.div
                    className="card-pro"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...smooth, delay: 0.5 }}
                >
                    <div className="card-pro__header">
                        <div className="card-pro__header-left">
                            <div className="card-pro__icon">
                                <BarChart3 size={18} strokeWidth={2.5} />
                            </div>
                            <h3>Plans Distribution</h3>
                        </div>
                    </div>
                    <div className="card-pro__content">
                        {loading ? (
                            <CardSkeleton height={260} />
                        ) : barData.length === 0 ? (
                            <div className="empty-pro">
                                <TrendingUp size={36} strokeWidth={1.5} />
                                <h4>No data available</h4>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={barData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={colors.primary} stopOpacity={0.9} />
                                            <stop offset="100%" stopColor={colors.primary} stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)", radius: 8 }} />
                                    <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 4, 4]} barSize={32} name="Organizations" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>
            )}

            {(!onlyBar || !onlyPie) && !onlyBar && (
                <motion.div
                    className="card-pro"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...smooth, delay: 0.3 }}
                >
                    <div className="card-pro__header">
                        <div className="card-pro__header-left">
                            <div className="card-pro__icon">
                                <Activity size={18} strokeWidth={2.5} />
                            </div>
                            <h3>Status Overview</h3>
                        </div>
                    </div>
                    {loading ? (
                        <div className="card-pro__content">
                            <CardSkeleton height={260} />
                        </div>
                    ) : pieData.length === 0 ? (
                        <div className="card-pro__content">
                            <div className="empty-pro">
                                <TrendingUp size={32} strokeWidth={1.5} />
                                <p>No data</p>
                            </div>
                        </div>
                    ) : (
                        <div className="status-content">
                            <ResponsiveContainer width="100%" height={200}>
                                <RechartsPie>
                                    <defs>
                                        {pieData.map((entry, i) => (
                                            <linearGradient key={i} id={`pie${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={entry.color} stopOpacity={0.95} />
                                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        stroke="none"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, i) => <Cell key={i} fill={`url(#pie${i})`} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </RechartsPie>
                            </ResponsiveContainer>
                            <div className="legend-list">
                                {pieData.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="legend-row"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ ...smooth, delay: 0.4 + i * 0.06 }}
                                    >
                                        <div className="legend-row__left">
                                            <span className="legend-dot" style={{ background: item.color }} />
                                            <span className="legend-name">{item.name}</span>
                                        </div>
                                        <span className="legend-val">{item.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </>
    );
};

export default DistributionCharts;
