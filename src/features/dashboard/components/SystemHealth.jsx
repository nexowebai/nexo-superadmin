import React from "react";
import { Activity, ShieldCheck, Zap, HardDrive, Cpu } from "lucide-react";
import { Card } from "@components/ui";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { motion } from "framer-motion";

export default function SystemHealth({ loading }) {
  if (loading)
    return (
      <Card padding="none" className="h-[400px] rounded-md overflow-hidden">
        <Skeleton variant="rect" width="100%" height="100%" />
      </Card>
    );

  const healthScore = 98.4;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <Card padding="none" className="rounded-md border-[var(--border-base)] bg-[var(--bg-surface)] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--border-base)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center border border-[var(--success-soft)]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Infrastructure</h3>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Health Status</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--success-soft)] text-[10px] font-black text-[var(--success)] border border-[var(--success-soft)] uppercase tracking-tighter">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          Live
        </div>
      </div>

      {/* Main Gauge Section - Increased Padding for height matching */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="var(--border-base)"
              strokeWidth="12"
              fill="transparent"
              className="opacity-20"
            />
            <motion.circle
              cx="96"
              cy="96"
              r={radius}
              stroke="url(#healthGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--success)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-black text-[var(--text-primary)] tracking-tighter"
            >
              {healthScore}%
            </motion.span>
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
              Global Health
            </span>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="mt-2 flex items-center gap-6 bg-[var(--bg-subtle)] px-6 py-3 rounded-2xl border border-[var(--border-base)]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Uptime</span>
            <span className="text-sm font-black text-[var(--text-primary)]">99.99%</span>
          </div>
          <div className="w-[1px] h-6 bg-[var(--border-base)]" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Latency</span>
            <span className="text-sm font-black text-[var(--text-primary)]">12ms</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid at Bottom */}
      <div className="grid grid-cols-2 gap-[1px] bg-[var(--border-base)] border-t border-[var(--border-base)]">
        <MetricBox icon={Cpu} label="CPU Load" value="24%" trend="Optimal" />
        <MetricBox icon={Zap} label="Memory" value="4.2GB" trend="Stable" />
        <MetricBox icon={HardDrive} label="Disk" value="12%" trend="Healthy" />
        <MetricBox icon={Activity} label="Traffic" value="1.2k/s" trend="Normal" />
      </div>
    </Card>
  );
}

function MetricBox({ icon: Icon, label, value, trend }) {
  return (
    <div className="bg-[var(--bg-surface)] p-5 flex flex-col gap-1 hover:bg-[var(--bg-subtle)] transition-colors cursor-default">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-muted)]">
          <Icon size={14} />
        </div>
        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base font-black text-[var(--text-primary)]">{value}</span>
        <span className="text-[10px] font-bold text-[var(--success)] uppercase">{trend}</span>
      </div>
    </div>
  );
}
