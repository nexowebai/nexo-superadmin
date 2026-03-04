import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, UserPlus, Shield,
  Clock, Inbox, CheckCheck, RefreshCw, Check, Trash2
} from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Button, Tabs } from '@components/ui';
import { SearchBar, StatsCard } from '@components/common';
import { useLayout } from '@context';
import {
  useNotifications, useMarkAsRead, useMarkAllAsRead,
  useDeleteNotification, useNotificationCount
} from '../../hooks/';
import notify from '@utils/notify';
import { formatDate, formatRelativeTime } from '@utils/format';
import { cn } from '@lib/cn';
import './NotificationsPage.css';

const MOCK_NOTIFICATIONS = [
  {
    id: 'NOT-001',
    title: 'New Organization Request',
    message: 'Stark Industries has requested to join the Nexo platform. Review the application in the requests tab.',
    type: 'user',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'NOT-002',
    title: 'Payment Received',
    message: 'A payment of $2,499 from Acme Foundation has been processed successfully for the Enterprise Plan.',
    type: 'success',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'NOT-003',
    title: 'High Latency Warning',
    message: 'Database latency in us-east-1 is higher than normal (450ms). System performance may be affected.',
    type: 'warning',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'NOT-004',
    title: 'System Security Alert',
    message: 'Multiple unauthorized access attempts detected from IP 142.250.190.46 in the last 15 minutes.',
    type: 'error',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'NOT-005',
    title: 'Daily Backup Completed',
    message: 'The scheduled system backup for all organizations has been completed successfully.',
    type: 'success',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'NOT-006',
    title: 'API Rate Limit Warning',
    message: 'Organization "Osborn Corp" is nearing its monthly API rate limit (92% used).',
    type: 'info',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  }
];

const TAB_OPTIONS = [
  { value: 'all', label: 'All Notifications' },
  { value: 'unread', label: 'Unread Only' },
];

function NotificationCard({ notification, onRead, onDelete }) {
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
        "notif-card flex flex-col p-6 bg-surface border border-base rounded-lg relative overflow-hidden transition-all duration-300 h-full",
        notification.is_read ? "opacity-80" : "shadow-sm border-primary/30"
      )}
    >
      {/* Icon and Title Row */}
      <div className="flex items-start gap-4 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${color}, transparent 90%)`, color }}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1 mt-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-primary m-0 tracking-tight leading-tight">{notification.title}</h3>
            {!notification.is_read && (
              <div className="shrink-0 pl-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest rounded-full border border-primary/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  New
                </span>
              </div>
            )}
          </div>
          {/* Type & Time below title */}
          <div className="flex items-center mb-4 gap-2 text-[11px] font-bold text-muted uppercase tracking-widest mt-2">
            <span style={{ color }}>{typeLabel}</span>
            <span className="w-1 h-1 bg-border-strong rounded-full" />
            <span>{formatRelativeTime(notification.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="text-[14px] font-medium text-secondary leading-relaxed flex-1">
        {notification.message}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-base mt-auto">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted uppercase tracking-widest">
          <Clock size={12} />
          <span>{formatDate(notification.created_at)}</span>
        </div>
        <div className="flex items-center gap-3">
          {!notification.is_read && (
            <button className="notif-btn notif-btn--read" onClick={() => onRead(notification.id)} title="Mark as read">
              <Check size={14} /> Mark read
            </button>
          )}
          <button className="notif-btn notif-btn--delete" onClick={() => onDelete(notification.id)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationsPage() {
  const { setHeaderProps } = useLayout();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const {
    data: realData,
    isLoading: loading,
    refetch,
  } = useNotifications({
    page,
    limit,
    unreadOnly: filter === 'unread' ? true : undefined,
    search: search || undefined
  });

  const { data: unreadCount = 0 } = useNotificationCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = useMemo(() => {
    const raw = realData?.notifications?.length > 0 ? realData.notifications : MOCK_NOTIFICATIONS;
    return raw.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase())
    );
  }, [realData, search]);

  useEffect(() => {
    setHeaderProps({
      title: "Notification Center",
      action: (
        <Button variant="secondary" icon={CheckCheck} onClick={handleMarkAllRead} disabled={unreadCount === 0} className="h-[48px] px-6">
          Clear All Unread
        </Button>
      )
    });
  }, [setHeaderProps, unreadCount]);

  const handleMarkAllRead = () => {
    notify.promise(
      new Promise((resolve, reject) => {
        markAllAsRead(null, {
          onSuccess: () => { refetch(); resolve(); },
          onError: reject
        });
      }),
      {
        loading: 'Cleaning up...',
        success: 'All caught up!',
        error: 'Failed to clear notifications'
      }
    );
  };

  const handleRead = (id) => markAsRead(id, { onSuccess: refetch });
  const handleDelete = (id) => deleteNotification(id, { onSuccess: refetch });

  return (
    <PageContainer>
      <div className="notif-top-stats">
        <StatsCard
          title="Total Notifications"
          value={notifications.length}
          icon={Bell}
          color="var(--primary)"
        />
        <StatsCard
          title="Unread Alerts"
          value={unreadCount}
          icon={AlertCircle}
          color="var(--error)"
        />
        <StatsCard
          title="System Status"
          value="Healthy"
          icon={Shield}
          color="var(--success)"
        />
      </div>

      <div className="notif-toolbar">
        <div className="notif-toolbar__left">
          <SearchBar
            placeholder="Search history..."
            value={search}
            onSearch={setSearch}
            size="md"
          />
        </div>
        <div className="notif-toolbar__right">
          <Tabs
            options={TAB_OPTIONS}
            value={filter}
            onChange={(v) => { setFilter(v); setPage(1); }}
          />
        </div>
      </div>

      <div className="notif-main-grid">
        {loading ? (
          <div className="notif-state notif-state--loading">
            <RefreshCw size={40} className="text-primary spinning" />
            <p>Synchronizing your alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-state notif-state--empty">
            <div className="empty-visual">
              <Inbox size={64} />
            </div>
            <h3>Zero Alerts Pending</h3>
            <p>You're all caught up! There are no messages matching your criteria right now.</p>
            <Button
              variant="primary"
              onClick={() => { setFilter('all'); setSearch(''); }}
              className="mt-6"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="notif-grid of-3">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onRead={handleRead}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default NotificationsPage;
