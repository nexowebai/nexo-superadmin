import React from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';
import DatePicker from '@components/ui/DatePicker/DatePicker';
import {
    AreaChart,
    Area,
    Grid,
    XAxis,
    YAxis,
    ChartTooltip
} from '@/components/ui/area-chart';
import { useRevenueAnalysis } from '../hooks/useRevenueAnalysis';

const FinancialPerformance = ({ loading }) => {
    const { selectedDate, setSelectedDate, chartData, stats } = useRevenueAnalysis();

    if (loading) return (
        <div className="h-[480px] w-full rounded-md bg-white animate-pulse border border-base" />
    );

    return (
        <div
            className="card-pro relative p-6 bg-surface border border-base shadow-sm overflow-hidden"
        >
            {/* Header Intelligence */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-emerald-500/5 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-primary tracking-tight m-0">Revenue Overview</h3>
                            <p className="text-muted text-xs font-medium m-0 opacity-80">Track your earnings and trends</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="stat-nx">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-1">Total Earnings</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">{stats.totalEarnings}</span>
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                    {stats.earningsTrend}
                                </span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-base" />
                        <div className="stat-nx">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-1">Total Costs</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">{stats.totalCosts}</span>
                                <span className="text-[10px] font-bold text-emerald-600/60 flex items-center bg-zinc-500/5 px-2 py-0.5 rounded-md border border-base">
                                    {stats.costsStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        className="w-[180px]"
                    />
                </div>
            </div>

            {/* Main Analysis Engine - Area Chart */}
            <div className="relative w-full mt-4">
                <AreaChart
                    data={chartData}
                    aspectRatio="3.5 / 1"
                    margin={{ top: 20, right: 10, bottom: 40, left: 45 }}
                >
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
                    <YAxis numTicks={5} formatValue={(v) => `$${(v / 1000).toFixed(0)}K`} />
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

            {/* Legend */}
            <div className="flex items-center justify-start gap-8 mt-10 pt-6 border-t border-base">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Operational Costs</span>
                </div>
            </div>
        </div>
    );
};

export default FinancialPerformance;
