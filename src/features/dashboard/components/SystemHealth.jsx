import { ShieldCheck, Zap, Activity } from "lucide-react";
import { cn } from "@lib/cn";
import { CardSkeleton } from "@components/ui/Card/Card";

const SystemHealth = ({ loading, systemHealth }) => {
    return (
        <div className="card-pro">
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
                        <div className="health-circle transition-all duration-300">
                            <svg className="health-svg" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="6" />
                                <circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke={systemHealth > 90 ? "#16a34a" : systemHealth > 70 ? "#f59e0b" : "#ef4444"}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={`${(systemHealth / 100) * 263.89} 263.89`}
                                    className="transition-all duration-1000 ease-in-out"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="health-inner">
                                <span className="health-val">{systemHealth}%</span>
                                <span className="health-label">UPTIME</span>
                            </div>
                        </div>
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
        </div>
    );
};

export default SystemHealth;
