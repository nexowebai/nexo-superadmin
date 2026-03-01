import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, Clock, Inbox, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { cn } from '@lib/cn';
import { useNotifications } from '@hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import './NotificationDrawer.css';

// Type icon mapping
const TYPE_ICONS = {
    success: { icon: CheckCircle2, className: 'text-success' },
    warning: { icon: AlertTriangle, className: 'text-warning' },
    error: { icon: AlertTriangle, className: 'text-error' },
    info: { icon: Info, className: 'text-info' },
};

// Skeleton loader for notifications
function NotificationSkeleton() {
    return (
        <div className="notification-list">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="notification-item">
                    <Skeleton width="36px" height="36px" borderRadius="50%" />
                    <div className="notification-details" style={{ flex: 1 }}>
                        <Skeleton width="70%" height="14px" />
                        <Skeleton width="90%" height="12px" style={{ marginTop: 6 }} />
                        <Skeleton width="60px" height="10px" style={{ marginTop: 6 }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function NotificationDrawer({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('all');

    // Fetch notifications from real API
    const {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    // Fetch notifications when drawer opens or tab changes
    useEffect(() => {
        if (isOpen) {
            fetchNotifications({
                limit: 20,
                unreadOnly: activeTab === 'unread' ? true : undefined
            });
        }
    }, [isOpen, activeTab, fetchNotifications]);

    const handleMarkAllRead = () => markAllAsRead();
    const handleMarkAsRead = (id) => markAsRead(id);

    // Get icon for notification type
    const getTypeIcon = (type) => {
        const config = TYPE_ICONS[type] || TYPE_ICONS.info;
        const IconComponent = config.icon;
        return <IconComponent size={18} className={config.className} />;
    };

    // Format time
    const formatTime = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="notification-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="notification-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="drawer-header">
                            <div className="drawer-title">
                                <Bell size={20} />
                                <h3>Notifications</h3>
                                {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                            </div>
                            <div className="drawer-actions">
                                <button
                                    className="refresh-btn"
                                    onClick={() => fetchNotifications({
                                        limit: 20,
                                        unreadOnly: activeTab === 'unread' ? true : undefined
                                    })}
                                    disabled={loading}
                                    title="Refresh"
                                >
                                    <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                                </button>
                                <button className="close-btn" onClick={onClose}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="drawer-tabs">
                            <button
                                className={cn('tab-btn', activeTab === 'all' && 'active')}
                                onClick={() => setActiveTab('all')}
                            >
                                All
                            </button>
                            <button
                                className={cn('tab-btn', activeTab === 'unread' && 'active')}
                                onClick={() => setActiveTab('unread')}
                            >
                                Unread
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    className="mark-read-btn"
                                    onClick={handleMarkAllRead}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="drawer-content">
                            {loading ? (
                                <NotificationSkeleton />
                            ) : notifications.length === 0 ? (
                                <div className="empty-notifications">
                                    <div className="empty-icon"><Inbox size={32} /></div>
                                    <p>No {activeTab === 'unread' ? 'unread ' : ''}notifications</p>
                                </div>
                            ) : (
                                <div className="notification-list">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={cn('notification-item', !notification.is_read && 'unread')}
                                            onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                                        >
                                            <div className="notification-icon">
                                                {getTypeIcon(notification.type)}
                                            </div>
                                            <div className="notification-details">
                                                <h4>{notification.title}</h4>
                                                <p>{notification.message}</p>
                                                <span className="notification-time">
                                                    {formatTime(notification.created_at)}
                                                </span>
                                            </div>
                                            {!notification.is_read && <div className="unread-dot" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default NotificationDrawer;
