import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    FolderKanban,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    LayoutGrid
} from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color, delay }) => {
    const isPositive = trend > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: "easeOut" }}
            className="group relative p-5 rounded-md bg-white border border-base hover:border-border-strong hover:shadow-md transition-all overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div
                    className="w-10 h-10 rounded-md flex items-center justify-center border border-base shadow-sm"
                    style={{ backgroundColor: `${color}10` }}
                >
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>

                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight ${isPositive ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'
                        }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    {label}
                </span>
                <h4 className="text-2xl font-bold text-primary tracking-tight">
                    {value}
                </h4>
            </div>
        </motion.div>
    );
};

const StatsOverview = ({ loading, metrics }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 rounded-md bg-white animate-pulse border border-base" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <StatCard key={metric.key} {...metric} delay={index * 0.05} />
            ))}
        </div>
    );
};

export default StatsOverview;
