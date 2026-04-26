import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { notificationService } from "@features/notifications/services/notificationService";
import { useAuth } from "@context/AuthContext";
import { useNotificationRealtime } from "./hooks/useNotificationRealtime";
import notify from "@utils/notify";

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
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback((options = {}) => {
    setLoading(true);
    const pageNum = options.page || 1;
    notificationService.getAll({ page: pageNum, limit: options.limit || 20, unread_only: options.unreadOnly })
      .then((res) => {
        if (!mountedRef.current) return;
        const { notifications: news = [], pagination = {}, unread_count: uc } = res?.data || {};
        if (options.append) {
          setNotifications((prev) => {
            const ids = new Set(prev.map((n) => n.id));
            return [...prev, ...news.filter((n) => !ids.has(n.id))];
          });
        } else setNotifications(news);
        if (typeof uc === "number") setUnreadCount(uc);
        setMeta(pagination); setHasMore(pageNum < (pagination.pages || 1));
        setPage(pageNum); setInitialFetched(true);
      })
      .finally(() => { if (mountedRef.current) setLoading(false); });
  }, []);

  const markAsRead = useCallback((id) => {
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    if (notif && !notif.is_read) setUnreadCount((prev) => Math.max(0, prev - 1));
    notificationService.markAsRead(id).catch(() => notify.error("Failed to mark read"));
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    notificationService.markAllAsRead().then(() => notify.success("All marked read")).catch(() => notify.error("Failed mark all"));
  }, []);

  const deleteNotification = useCallback((id) => {
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.is_read) setUnreadCount((prev) => Math.max(0, prev - 1));
    notificationService.delete(id).then(() => notify.success("Deleted")).catch(() => notify.error("Failed delete"));
  }, [notifications]);

  useEffect(() => {
    mountedRef.current = true;
    if (!userId) { setNotifications([]); setUnreadCount(0); setInitialFetched(false); }
    return () => { mountedRef.current = false; };
  }, [userId]);

  useNotificationRealtime({ userId, setNotifications, setUnreadCount, setRealtimeConnected, mountedRef });

  const value = {
    notifications, unreadCount, loading, page, hasMore, meta,
    realtimeConnected, initialFetched, fetchNotifications,
    markAsRead, markAllAsRead, deleteNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};
