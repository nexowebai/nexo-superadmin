import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Smartphone, Cloud, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@lib/cn';

const RESOURCE_DATA = [
    { name: 'Basic Tier', usage: 12, limit: 100, icon: Package },
    { name: 'Pro Tier', usage: 84, limit: 250, icon: Smartphone },
    { name: 'Enterprise', usage: 489, limit: 1000, icon: Cloud },
    { name: 'Internal', usage: 22, limit: 50, icon: Layers },
];

export default function ResourceAnalytics({ loading }) {
    if (loading) return <div className="card-pro h-[300px] nx-skeleton-pulse" />;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-pro p-6 lg:p-8 h-full flex flex-col bg-surface-lowest/50 backdrop-blur-xl border-base/40 shadow-premium"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-info-soft text-info flex items-center justify-center border border-info/20 shadow-inner">
                    <Package size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-primary text-lg m-0 leading-none mb-1.5">Platform Allocation</h3>
                    <p className="text-xs font-bold text-muted uppercase tracking-[0.15em] m-0 opacity-70">Distribution per Subscription Tier</p>
                </div>
            </div>

            <div className="flex-1 space-y-8">
                {RESOURCE_DATA.map((item, index) => {
                    const percent = Math.round((item.usage / item.limit) * 100);
                    const Icon = item.icon;
                    return (
                        <div key={index} className="resource-item group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-elevated text-secondary flex items-center justify-center group-hover:bg-primary-soft group-hover:text-primary transition-all duration-300">
                                        <Icon size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-primary">{item.name}</span>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-base font-black text-primary">{item.usage}</span>
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">/ {item.limit} slots</span>
                                </div>
                            </div>

                            <div className="relative w-full h-2.5 bg-base/30 rounded-full overflow-hidden mb-1 border border-base/20 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1.5, delay: 0.1 * index, ease: "circOut" }}
                                    className={cn(
                                        "h-full rounded-full shadow-glow-primary",
                                        percent > 90 ? "bg-error shadow-glow-error" : percent > 70 ? "bg-warning shadow-glow-warning" : "bg-primary shadow-glow-primary"
                                    )}
                                />
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] opacity-60">Utilization Index</span>
                                <span className={cn(
                                    "text-[10px] font-black",
                                    percent > 90 ? "text-error" : percent > 70 ? "text-warning" : "text-primary"
                                )}>{percent}% capacity used</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-base/40 flex justify-between items-center bg-elevated/30 -mx-6 -mb-6 px-6 py-4 rounded-b-3xl">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">Cumulative Usage</span>
                    <span className="text-lg font-black text-primary">607 Organizations</span>
                </div>
                <button className="h-10 px-5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                    Audit Resources
                </button>
            </div>
        </motion.div>
    );
}
