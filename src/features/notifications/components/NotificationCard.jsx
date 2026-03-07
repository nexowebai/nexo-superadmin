import React from 'react';
import { motion } from 'framer-motion';
import {
    Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, UserPlus, Shield, Clock, Check, Trash2
} from 'lucide-react';
import { cn } from '@lib/cn';
import { formatDate, formatRelativeTime } from '@utils/format';

export function NotificationCard({ notification, onRead, onDelete }) {
    const config = {
        success: { color: 'var(--success)', icon: CheckCircle2, label: 'Success' },
        warning: { color: 'var(--warning)', icon: AlertTriangle, label: 'Warning' },
        error: { color: 'var(--error)', icon: AlertCircle, label: 'Alert' },
        info: { color: 'var(--info)', icon: Info, label: 'Info' },
        user: { color: 'var(--primary)', icon: UserPlus, label: 'User' },
        security: { color: 'var(--error)', icon: Shield, label: 'Security' },
    };

    const { color = 'var(--text-muted)', icon: Icon = Bell, label: typeLabel } = config[notification.type] || {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "flex flex-col p-6 bg-surface border rounded-md relative overflow-hidden transition-all duration-300 h-full shadow-sm",
                notification.is_read ? "opacity-70 border-base" : "border-primary/20 bg-primary/[0.02]"
            )}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 border"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${color}, transparent 92%)`,
                        color,
                        borderColor: `color-mix(in srgb, ${color}, transparent 80%)`
                    }}>
                    <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-bold text-primary m-0 tracking-tight leading-snug line-clamp-1">
                            {notification.title}
                        </h3>
                        {!notification.is_read && (
                            <span className="shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5 shadow-[0_0_8px_var(--primary)]" />
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-60" style={{ color }}>{typeLabel}</span>
                        <span className="w-1 h-1 bg-muted rounded-full opacity-30" />
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{formatRelativeTime(notification.created_at)}</span>
                    </div>
                </div>
            </div>

            <p className="text-[13px] font-medium text-secondary/80 leading-relaxed flex-1 m-0 mb-6">
                {notification.message}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-base/50 mt-auto">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">
                    <Clock size={11} />
                    <span>{formatDate(notification.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                    {!notification.is_read && (
                        <button
                            className="h-8 px-3 rounded-md border border-primary text-primary text-[10px] font-black uppercase tracking-wider bg-white hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                            onClick={() => onRead(notification.id)}
                        >
                            <Check size={12} /> Mark read
                        </button>
                    )}
                    <button
                        className="h-8 w-8 rounded-md border border-base text-muted hover:text-error hover:border-error/30 hover:bg-error/5 transition-all flex items-center justify-center"
                        onClick={() => onDelete(notification.id)}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
