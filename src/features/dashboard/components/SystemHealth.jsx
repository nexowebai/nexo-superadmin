import React from "react";
import { Activity, ShieldCheck, Zap, HardDrive } from "lucide-react";
import { Card } from "@components/ui";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";

export default function SystemHealth({ loading }) {
  if (loading)
    return (
      <Card variant="nx" className="system-health-card">
        <Skeleton variant="rect" width="100%" height="280px" />
      </Card>
    );

  const healthValue = 98;
  const strokeDasharray = 2 * Math.PI * 56;
  const strokeDashoffset =
    strokeDasharray - (healthValue / 100) * strokeDasharray;

  return (
    <Card variant="nx" padding="lg" className="system-health-card">
      <div className="health-compact-header">
        <div className="health-header__info">
          <div className="health-header__icon">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="health-header__title">System Health</h3>
            <p className="health-header__subtitle">Infrastructure Status</p>
          </div>
        </div>
        <div className="health-badge health-badge--mini">
          <div className="health-badge__dot" />
          <span>OPERATIONAL</span>
        </div>
      </div>

      <div className="health-gauge">
        <svg className="health-gauge__svg" viewBox="0 0 128 128">
          <circle className="health-gauge__track" cx="64" cy="64" r="56" />
          <circle
            className="health-gauge__progress"
            cx="64"
            cy="64"
            r="56"
            style={{ strokeDasharray, strokeDashoffset }}
          />
        </svg>
        <div className="health-gauge__label">
          <span className="health-gauge__value">{healthValue}%</span>
          <span className="health-gauge__text">Optimized</span>
        </div>
      </div>

      <div className="health-metrics-grid">
        <MetricRow
          icon={ShieldCheck}
          label="API Uptime"
          value="100%"
          color="var(--success)"
        />
        <MetricRow icon={Zap} label="Response" value="12ms" color="#0ea5e9" />
        <MetricRow
          icon={HardDrive}
          label="Database"
          value="Normal"
          color="#8b5cf6"
        />
        <MetricRow
          icon={Activity}
          label="Auto Scaler"
          value="Active"
          color="#f59e0b"
        />
      </div>
    </Card>
  );
}

function MetricRow({ icon: Icon, label, value, color }) {
  return (
    <div className="health-stat-row">
      <div className="health-stat-row__icon" style={{ color }}>
        <Icon size={14} />
      </div>
      <span className="health-stat-row__label">{label}</span>
      <span className="health-stat-row__value">{value}</span>
    </div>
  );
}
