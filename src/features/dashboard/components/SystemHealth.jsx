import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Zap,
    Globe,
    Database,
} from 'lucide-react';

const HealthMetric = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="flex flex-col gap-2 p-4 rounded-md bg-surface-base border border-base hover:border-primary/30 transition-all cursor-default group"
    >
        <div className="flex items-center gap-2">
            <div
                className="w-6 h-6 rounded-md flex items-center justify-center border border-base bg-surface shadow-sm"
                style={{ color }}
            >
                <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted opacity-70">{label}</span>
        </div>
        <span className="text-xl font-bold text-primary tabular-nums tracking-tight">{value}</span>
    </motion.div>
);

const SystemHealth = ({ loading, systemHealth = 99.98 }) => {
    return (
        <div className="p-6 rounded-md bg-surface border border-base shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary tracking-tight m-0">System Health</h3>
                        <p className="text-xs font-medium text-muted m-0">Real-time status</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</span>
                </div>
            </div>

            <div className="flex flex-col gap-8 flex-1">
                {/* Visual Gauge */}
                <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64" cy="64" r="56"
                                fill="none" stroke="var(--border-dimmed)" strokeWidth="8"
                            />
                            <motion.circle
                                initial={{ strokeDashoffset: 351.85 }}
                                animate={{ strokeDashoffset: 351.85 - (351.85 * (systemHealth / 100)) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="64" cy="64" r="56"
                                fill="none" stroke="var(--primary)" strokeWidth="8"
                                strokeDasharray="351.85"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-primary tracking-tight">{systemHealth}%</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted">Uptime</span>
                        </div>
                    </div>
                </div>

                {/* Metrics Stack */}
                <div className="grid grid-cols-1 gap-2 mt-auto">
                    <div className="grid grid-cols-2 gap-2">
                        <HealthMetric label="System Speed" value="28ms" icon={Zap} color="#10b981" delay={0.1} />
                        <HealthMetric label="API Load" value="Perfect" icon={Globe} color="#3b82f6" delay={0.2} />
                    </div>
                    <HealthMetric label="Database Sync" value="94% Synced" icon={Database} delay={0.3} color="#8b5cf6" />
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
