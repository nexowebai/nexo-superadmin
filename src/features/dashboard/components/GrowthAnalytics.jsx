import { motion } from 'framer-motion';
import { TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_GROWTH = [
    { name: 'Mon', active: 400, new: 240 },
    { name: 'Tue', active: 520, new: 139 },
    { name: 'Wed', active: 680, new: 980 },
    { name: 'Thu', active: 890, new: 390 },
    { name: 'Fri', active: 1100, new: 480 },
    { name: 'Sat', active: 1350, new: 380 },
    { name: 'Sun', active: 1600, new: 430 },
];

export default function GrowthAnalytics({ loading }) {
    if (loading) return null;

    return (
        <motion.div
            className="card-pro mb-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-primary m-0 text-lg">Platform Growth</h3>
                        <p className="text-sm text-secondary m-0">Real-time user & organization activity across the network</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Active</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-primary">1,642</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-success-soft text-success flex items-center gap-1">
                                <ArrowUpRight size={10} /> 12%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full p-6 pt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--info)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--info)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-elevated)',
                                borderRadius: '16px',
                                border: '1px solid var(--border-base)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                padding: '12px'
                            }}
                            cursor={{ stroke: 'var(--primary)', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="active"
                            stroke="var(--primary)"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorActive)"
                            name="Active Users"
                        />
                        <Area
                            type="monotone"
                            dataKey="new"
                            stroke="var(--info)"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorNew)"
                            name="New Signups"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
