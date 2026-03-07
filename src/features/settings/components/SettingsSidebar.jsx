import React from 'react';
import { Cpu, Activity } from 'lucide-react';

const ResourceMetric = ({ label, value }) => (
    <div className="flex justify-between items-center p-4 rounded-md bg-surface-base border border-base group hover:border-primary/20 transition-all">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider opacity-60">{label}</span>
        <span className="text-xs font-bold text-primary tabular-nums">{value}</span>
    </div>
);

export function SettingsSidebar({ systemName }) {
    return (
        <div className="space-y-6">
            <div className="p-8 rounded-md bg-white border border-base shadow-sm text-center">
                <div className="w-20 h-20 rounded-md bg-zinc-50 text-primary flex items-center justify-center mx-auto mb-6 border border-base shadow-inner">
                    <Cpu size={32} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-black text-primary mb-1 tracking-tight truncate px-2">
                    {systemName}
                </h4>
                <div className="mx-auto w-fit px-3 py-1 bg-primary text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-full mb-8 shadow-sm">
                    Production v4.2
                </div>

                <div className="space-y-3">
                    <ResourceMetric label="Resource Load" value="78.4%" />
                    <ResourceMetric label="API Latency" value="42ms" />
                    <ResourceMetric label="Encryption" value="AES-256" />
                </div>
            </div>

            <div className="p-5 bg-zinc-50 rounded-md border border-base flex items-start gap-4 hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center shrink-0 shadow-sm border border-primary transition-transform group-hover:scale-105">
                    <Activity size={20} />
                </div>
                <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-primary uppercase tracking-[0.15em] m-0">Live Engine Status</h5>
                    <p className="text-[10px] leading-relaxed font-bold text-primary/70 m-0 italic">
                        Changes synchronize across organization nodes within 45 seconds of state commit.
                    </p>
                </div>
            </div>
        </div>
    );
}
