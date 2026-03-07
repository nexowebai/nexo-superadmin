import React from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    ShieldAlert,
    MoreVertical
} from 'lucide-react';
import { Button } from '@components/ui';

const ActivityItem = ({ icon: Icon, title, subtitle, time, status, delay }) => (
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

        <div className="min-w-0 pr-4">
            <h4 className="text-[13px] font-bold text-primary tracking-tight leading-tight truncate m-0 group-hover:text-primary transition-colors">
                {title}
            </h4>
            <p className="text-[11px] font-medium text-muted line-clamp-1 m-0 mt-1 opacity-70">{subtitle}</p>

            <div className="flex items-center gap-1.5 mt-2.5 opacity-40">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{time} ago</span>
            </div>
        </div>

        {status === 'unread' && (
            <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        )}
    </motion.div>
);

const NotificationCenter = ({ loading, notifications = [] }) => {
    // Mock some high-fidelity notifications if empty
    const mockNotifications = [
        { id: 1, title: "Update Successful", subtitle: "System update applied to 14 nodes", time: "2m", status: "unread", icon: CheckCircle2 },
        { id: 2, title: "Security Alert", subtitle: "Login attempt from new location", time: "15m", status: "unread", icon: ShieldAlert },
        { id: 3, title: "Storage Warning", subtitle: "Cloud storage approaching limit", time: "1h", status: "read", icon: AlertCircle },
    ];

    const displayList = notifications.length > 0 ? notifications : mockNotifications;

    return (
        <div className="p-6 rounded-md bg-surface border border-base shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-surface-base flex items-center justify-center border border-base">
                        <Bell className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary tracking-tight m-0">Notifications</h3>
                        <p className="text-xs font-medium text-muted m-0">Recent system updates</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-8 h-8 rounded-md border border-base bg-surface-subtle hover:bg-surface-elevated p-0 text-muted transition-all">
                    <MoreVertical className="w-4 h-4" />
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
                            icon={notif.icon || Bell}
                        />
                    ))
                }
            </div>

            <Button variant="ghost" className="w-full h-10 bg-surface-subtle border border-base rounded-md mt-6 text-[10px] font-bold uppercase tracking-widest text-muted hover:bg-surface-elevated transition-all shadow-sm">
                View All Events
                <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
        </div>
    );
};

export default NotificationCenter;
