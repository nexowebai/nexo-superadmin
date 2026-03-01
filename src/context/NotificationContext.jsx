import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { subscribeToNotifications, unsubscribeFromChannel } from '@lib/supabase';
import { notificationsApi } from '@features/api/superAdminApi';
import { useAuth } from '@context/AuthContext';
import notify from '@utils/notify';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user: currentUser } = useAuth();
  const userId = currentUser?.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [meta, setMeta] = useState({});
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [initialFetched, setInitialFetched] = useState(false);

  const channelRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback((options = {}) => {
    setLoading(true);

    const pageNum = options.page || 1;
    const limit = options.limit || 20;

    notificationsApi
      .getAll({ page: pageNum, limit, unread_only: options.unreadOnly })
      .then((response) => {
        if (!mountedRef.current) return;
        const data = response?.data;
        const newNotifications = data?.notifications || [];
        const pagination = data?.pagination || {};

        if (options.append) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const uniqueNew = newNotifications.filter((n) => !existingIds.has(n.id));
            return [...prev, ...uniqueNew];
          });
        } else {
          setNotifications(newNotifications);
        }

        if (typeof data?.unread_count === 'number') {
          setUnreadCount(data.unread_count);
        }

        setMeta(pagination);
        setHasMore(pageNum < (pagination.pages || 1));
        setPage(pageNum);
        setInitialFetched(true);
      })
      .catch(() => { })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
  }, []);

  const markAsRead = useCallback((notificationId) => {
    const notif = notifications.find((n) => n.id === notificationId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );

    if (notif && !notif.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    notificationsApi.markAsRead(notificationId).catch(() => {
      notify.error('Failed to mark notification as read');
    });
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    notificationsApi
      .markAllAsRead()
      .then(() => notify.success('All notifications marked as read'))
      .catch(() => notify.error('Failed to mark notifications as read'));
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    const notif = notifications.find((n) => n.id === notificationId);

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    if (notif && !notif.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    notificationsApi
      .delete(notificationId)
      .then(() => notify.success('Notification deleted'))
      .catch(() => notify.error('Failed to delete notification'));
  }, [notifications]);

  useEffect(() => {
    mountedRef.current = true;

    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setInitialFetched(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || channelRef.current) return;

    const channel = subscribeToNotifications(userId, {
      onInsert: (newNotification) => {
        if (!mountedRef.current) return;

        setRealtimeConnected(true);
        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [newNotification, ...prev];
        });
        if (!newNotification.is_read) {
          setUnreadCount((prev) => prev + 1);
        }
      },
      onUpdate: (updatedNotification) => {
        if (!mountedRef.current) return;

        setRealtimeConnected(true);
        setNotifications((prev) => {
          const oldNotif = prev.find((n) => n.id === updatedNotification.id);
          if (oldNotif && !oldNotif.is_read && updatedNotification.is_read) {
            setUnreadCount((count) => Math.max(0, count - 1));
          } else if (oldNotif && oldNotif.is_read && !updatedNotification.is_read) {
            setUnreadCount((count) => count + 1);
          }
          return prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n));
        });
      },
      onDelete: (deletedNotification) => {
        if (!mountedRef.current) return;

        setRealtimeConnected(true);
        setNotifications((prev) => prev.filter((n) => n.id !== deletedNotification.id));
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      },
      onConnectionChange: (status) => {
        if (mountedRef.current) {
          setRealtimeConnected(status === 'SUBSCRIBED');
        }
      },
    });

    channelRef.current = channel;

    return () => { };
  }, [userId]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    page,
    hasMore,
    meta,
    realtimeConnected,
    initialFetched,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
