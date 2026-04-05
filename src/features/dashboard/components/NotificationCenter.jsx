import React from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    ShieldAlert,
    MoreVertical,
    Trash2
} from 'lucide-react';
import { Button } from '@components/ui';
import { MOCK_NOTIFICATIONS } from '../constants/dashboardData';

const ICON_MAP = {
    'CheckCircle2': CheckCircle2,
    'ShieldAlert': ShieldAlert,
    'AlertCircle': AlertCircle,
    'Bell': Bell
};

const ActivityItem = ({ icon, title, subtitle, time, status, delay }) => {
    const Icon = typeof icon === 'string' ? (ICON_MAP[icon] || Bell) : (icon || Bell);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="group relative flex items-start gap-4 p-4 rounded-md bg-surface-base border border-base hover:border-primary/30 transition-all cursor-pointer"
        >
            <div className={`w-8 h-8 rounded-md border border-base shrink-0 flex items-center justify-center ${status === 'unread' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' : 'bg-surface text-muted/30'
                }`}>
                <Icon className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1 pr-6">
                <h4 className="text-[13px] font-bold text-primary tracking-tight leading-tight truncate m-0 group-hover:text-primary transition-colors">
                    {title}
                </h4>
                <p className="text-[11px] font-medium text-muted line-clamp-1 m-0 mt-1 opacity-70">{subtitle}</p>

                <div className="flex items-center gap-1.5 mt-2.5 opacity-40">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{time} ago</span>
                </div>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
                {status === 'unread' && (
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                )}
                <button 
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    onClick={(e) => {
                        e.stopPropagation();
                        // handle delete
                    }}
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </motion.div>
    );
}

const NotificationCenter = ({ loading, notifications = [] }) => {
    const displayList = notifications.length > 0 ? notifications : MOCK_NOTIFICATIONS;

    return (
        <div className="card-pro p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-surface-base flex items-center justify-center border border-base">
                        <Bell className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary tracking-tight m-0">Notifications</h3>
                        <p className="text-xs font-medium text-muted m-0">Recent events</p>
                    </div>
                </div>
                <Button variant="ghost" className="h-9 px-4 rounded-md border border-base bg-surface-base hover:bg-surface-elevated text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                    View All
                </Button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {loading
                    ? [1, 2, 3].map(i => <div key={i} className="h-20 rounded-md bg-surface-base animate-pulse border border-base" />)
                    : displayList.map((notif, i) => (
                        <ActivityItem
                            key={notif.id}
                            {...notif}
                            delay={i * 0.05}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default NotificationCenter;
