import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, UserPlus, Database,
  Shield, Server, Mail, Activity, Trash2, LayoutGrid, List, ChevronLeft,
  ChevronRight, Clock, Inbox, CheckCheck, RefreshCw,
} from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { Tabs } from '@components/ui';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { cn } from '@lib/cn';
import { formatDistanceToNow } from 'date-fns';
import { useLayout } from '@context';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification, useNotificationCount } from '../../hooks/';
import './NotificationsPage.css';

const TAB_OPTIONS = [
  { value: 'all', label: 'All Notifications' },
  { value: 'unread', label: 'Unread Only' },
];

const TYPE_CONFIGS = {
  success: { icon: CheckCircle2, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-700', borderColor: 'border-emerald-300', badgeColor: 'badge-emerald' },
  warning: { icon: AlertTriangle, bgColor: 'bg-amber-50', iconColor: 'text-amber-700', borderColor: 'border-amber-300', badgeColor: 'badge-amber' },
  error: { icon: AlertCircle, bgColor: 'bg-rose-50', iconColor: 'text-rose-700', borderColor: 'border-rose-300', badgeColor: 'badge-rose' },
  info: { icon: Info, bgColor: 'bg-blue-50', iconColor: 'text-blue-700', borderColor: 'border-blue-300', badgeColor: 'badge-blue' },
  activity: { icon: Activity, bgColor: 'bg-violet-50', iconColor: 'text-violet-700', borderColor: 'border-violet-300', badgeColor: 'badge-violet' },
  user: { icon: UserPlus, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-700', borderColor: 'border-indigo-300', badgeColor: 'badge-indigo' },
  database: { icon: Database, bgColor: 'bg-cyan-50', iconColor: 'text-cyan-700', borderColor: 'border-cyan-300', badgeColor: 'badge-cyan' },
  security: { icon: Shield, bgColor: 'bg-red-50', iconColor: 'text-red-700', borderColor: 'border-red-300', badgeColor: 'badge-red' },
  server: { icon: Server, bgColor: 'bg-slate-50', iconColor: 'text-slate-700', borderColor: 'border-slate-300', badgeColor: 'badge-slate' },
  mail: { icon: Mail, bgColor: 'bg-teal-50', iconColor: 'text-teal-700', borderColor: 'border-teal-300', badgeColor: 'badge-teal' },
};

function NotificationSkeleton({ count = 6, viewMode }) {
  return (
    <div className={cn('notif-content', `view-${viewMode}`)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="notif-item notif-skeleton">
          <div className="notif-header">
            <Skeleton width="44px" height="44px" borderRadius="12px" />
            <Skeleton width="70%" height="18px" />
          </div>
          <Skeleton width="90%" height="14px" />
          <Skeleton width="100px" height="24px" borderRadius="20px" />
        </div>
      ))}
    </div>
  );
}

function NotificationsPage() {
  const { setHeaderProps } = useLayout();
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const pageSize = viewMode === 'grid' ? 12 : 8;

  const {
    data,
    isLoading: loading,
    refetch,
  } = useNotifications({
    page,
    limit: pageSize,
    unreadOnly: filter === 'unread' ? true : undefined,
  });

  const { notifications = [], pagination: meta } = data || {};
  const { data: unreadCount = 0 } = useNotificationCount();

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const total = meta?.total || 0;
  const totalPages = meta?.pages || 0;

  const handleMarkAllRead = () => markAllAsRead(null, { onSuccess: refetch });
  const handleDelete = (id) => deleteNotification(id, { onSuccess: refetch });
  const handleRead = (notification) => {
    if (!notification.is_read) markAsRead(notification.id, { onSuccess: refetch });
  };

  const handleRefresh = () => refetch();

  useEffect(() => {
    setHeaderProps({
      title: "Notifications",
      action: (
        <Button variant="outline" icon={Bell} onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          Mark All Read ({unreadCount})
        </Button>
      )
    });
  }, [setHeaderProps, loading, unreadCount]);

  const getTypeConfig = (type) => TYPE_CONFIGS[type] || TYPE_CONFIGS.info;

  return (
    <PageContainer>
      <div className="notif-main">
        <div className="notif-toolbar">
          <Tabs options={TAB_OPTIONS} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} />
          <div className="view-switcher">
            <button className={cn('view-btn', viewMode === 'grid' && 'active')} onClick={() => { setViewMode('grid'); setPage(1); }}>
              <LayoutGrid />
            </button>
            <button className={cn('view-btn', viewMode === 'list' && 'active')} onClick={() => { setViewMode('list'); setPage(1); }}>
              <List />
            </button>
          </div>
        </div>

        {loading ? (
          <NotificationSkeleton count={pageSize} viewMode={viewMode} />
        ) : (
          <div className={cn('notif-content', `view-${viewMode}`)}>
            <AnimatePresence mode="popLayout">
              {notifications.length > 0 ? (
                notifications.map((notif) => {
                  const config = getTypeConfig(notif.type);
                  const IconComponent = config.icon;
                  const isRead = notif.is_read;

                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={cn('notif-item', isRead ? 'notif-read' : config.borderColor)}
                      onClick={() => handleRead(notif)}
                    >
                      <div className="notif-header">
                        <div className={cn('notif-icon', isRead ? 'icon-read' : config.bgColor)}>
                          <IconComponent className={isRead ? 'text-read' : config.iconColor} />
                        </div>
                        <h3 className={cn('notif-title', isRead && 'title-read')}>{notif.title}</h3>
                        <button className="notif-delete" onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }} aria-label="Delete">
                          <Trash2 />
                        </button>
                      </div>
                      <p className={cn('notif-message', isRead && 'message-read')}>{notif.message}</p>
                      <div className={cn('notif-time-badge', isRead ? 'badge-read' : config.badgeColor)}>
                        <Clock />
                        <span>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="notif-empty"
                >
                  {filter === 'unread' ? (
                    <>
                      <motion.div className="empty-icon-box" initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                        <CheckCheck />
                      </motion.div>
                      <motion.h3 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>All Caught Up!</motion.h3>
                      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>You have no unread notifications</motion.p>
                    </>
                  ) : (
                    <>
                      <motion.div className="empty-icon-box" initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <Inbox />
                      </motion.div>
                      <motion.h3 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>No Notifications Yet</motion.h3>
                      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>When you get notifications, they'll show up here</motion.p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="notif-footer">
            <button className="footer-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft /> Previous
            </button>
            <span className="footer-info">Page {page} of {totalPages}</span>
            <button className="footer-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default NotificationsPage;
