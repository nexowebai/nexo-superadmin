import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@lib/cn";
import { useNotifications } from "@hooks/useNotifications";
import NotificationSkeleton from "./components/NotificationSkeleton";
import NotificationItem from "./components/NotificationItem";
import "./NotificationDrawer.css";

export function NotificationDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("all");
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications({
        limit: 20,
        unreadOnly: activeTab === "unread" ? true : undefined,
      });
    }
  }, [isOpen, activeTab, fetchNotifications]);

  const handleRefresh = () => {
    fetchNotifications({
      limit: 20,
      unreadOnly: activeTab === "unread" ? true : undefined,
    });
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="drawer-header">
              <div className="drawer-title">
                <Bell size={20} />
                <h3>Notifications</h3>
                {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
              </div>
              <div className="drawer-actions">
                <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw size={16} className={loading ? "spinning" : ""} />
                </button>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
              </div>
            </div>

            <div className="drawer-tabs">
              <button
                className={cn("tab-btn", activeTab === "all" && "active")}
                onClick={() => setActiveTab("all")}
              >All</button>
              <button
                className={cn("tab-btn", activeTab === "unread" && "active")}
                onClick={() => setActiveTab("unread")}
              >Unread</button>
              {unreadCount > 0 && (
                <button className="mark-read-btn" onClick={markAllAsRead}>
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
                  <p>No {activeTab === "unread" ? "unread " : ""}notifications</p>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      onMarkAsRead={markAsRead} 
                    />
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
