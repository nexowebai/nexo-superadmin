import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity } from "lucide-react";
import { cn } from "@lib/cn";
import { CardSkeleton } from "@components/ui/Card/Card";

const smooth = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };
const spring = { type: "spring", stiffness: 300, damping: 30 };

const SystemHealth = ({ loading, systemHealth }) => {
    return (
        <motion.div
            className="card-pro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smooth, delay: 0.35 }}
        >
            <div className="card-pro__header">
                <div className="card-pro__header-left">
                    <div className="card-pro__icon">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                    </div>
                    <h3>System Health</h3>
                </div>
            </div>

            <div className="card-pro__content">
                <div className="health-split">
                    <div className="health-split__left">
                        <motion.div
                            className="health-circle"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ ...smooth, delay: 0.4 }}
                        >
                            <svg className="health-svg" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="6" />
                                <motion.circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke={systemHealth > 90 ? "#16a34a" : systemHealth > 70 ? "#f59e0b" : "#ef4444"}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={`${(systemHealth / 100) * 263.89} 263.89`}
                                    initial={{ strokeDasharray: "0 263.89" }}
                                    animate={{ strokeDasharray: `${(systemHealth / 100) * 263.89} 263.89` }}
                                    transition={{ duration: 1.5, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="health-inner">
                                <span className="health-val">{systemHealth}%</span>
                                <span className="health-label">UPTIME</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="health-split__right">
                        <div className="health-stat-mini">
                            <div className="h-s-icon"><Zap size={14} /></div>
                            <div className="h-s-info">
                                <span className="h-s-label">Latency</span>
                                <span className="h-s-value">38ms</span>
                            </div>
                        </div>
                        <div className="health-stat-mini">
                            <div className="h-s-icon"><Activity size={14} /></div>
                            <div className="h-s-info">
                                <span className="h-s-label">API Status</span>
                                <span className="h-s-value">100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cn("health-status-footer", systemHealth > 95 ? "stable" : "checking")}>
                    <div className="pulse-dot" />
                    <span>{systemHealth > 95 ? "All systems operational" : "System performance alert"}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemHealth;
