import React from 'react';
import { Cpu, Activity } from 'lucide-react';

const ResourceMetric = ({ label, value }) => (
    <div className="resource-metric">
        <span className="resource-metric__label">{label}</span>
        <span className="resource-metric__value">{value}</span>
    </div>
);

export function SettingsSidebar({ systemName }) {
    return (
        <div className="settings-sidebar-stack">
            <div className="system-status-card">
                <div className="system-status-icon-nx">
                    <Cpu size={32} strokeWidth={2.5} />
                </div>
                <h4 className="system-status-name">
                    {systemName}
                </h4>
                <div className="system-status-badge">
                    Production v4.2
                </div>

                <div className="resource-metrics-list">
                    <ResourceMetric label="Resource Load" value="78.4%" />
                    <ResourceMetric label="API Latency" value="42ms" />
                    <ResourceMetric label="Encryption" value="AES-256" />
                </div>
            </div>

            <div className="engine-status-banner">
                <div className="engine-status-icon-nx">
                    <Activity size={20} />
                </div>
                <div className="engine-status-content">
                    <h5 className="engine-status-title">Live Engine Status</h5>
                    <p className="engine-status-text">
                        Changes synchronize across organization nodes within 45 seconds of state commit.
                    </p>
                </div>
            </div>
        </div>
    );
}
