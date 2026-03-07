import React from 'react';
import {
    Info, CheckCircle2, AlertTriangle, XCircle, User, Shield, RefreshCw, Database, Download, Terminal
} from 'lucide-react';

export function LevelBadge({ level }) {
    const config = {
        info: { color: 'var(--info)', bg: 'var(--info-soft)', icon: Info },
        success: { color: 'var(--success)', bg: 'var(--success-soft)', icon: CheckCircle2 },
        warn: { color: 'var(--warning)', bg: 'var(--warning-soft)', icon: AlertTriangle },
        error: { color: 'var(--error)', bg: 'var(--error-soft)', icon: XCircle },
    };
    const { color, bg, icon: Icon } = config[level] || config.info;

    return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider border transition-all"
            style={{
                color,
                backgroundColor: bg,
                borderColor: `color-mix(in srgb, ${color} 20%, transparent)`
            }}>
            <Icon size={11} strokeWidth={3} />
            <span>{level.toUpperCase()}</span>
        </div>
    );
}

export function TypeBadge({ type }) {
    const config = {
        login: { color: 'var(--primary)', icon: User, label: 'AUTH' },
        security: { color: 'var(--error)', icon: Shield, label: 'SEC' },
        update: { color: 'var(--success)', icon: RefreshCw, label: 'UPD' },
        database: { color: 'var(--warning)', icon: Database, label: 'DB' },
        export: { color: 'var(--info)', icon: Download, label: 'EXP' },
    };
    const { color = 'var(--text-muted)', icon: Icon = Terminal, label = 'SYS' } = config[type?.toLowerCase()] || {};

    return (
        <div className="flex items-center gap-1.5 font-bold text-[10px] tracking-wide" style={{ color }}>
            <Icon size={11} className="opacity-70" />
            <span className="opacity-90">{label}</span>
        </div>
    );
}
