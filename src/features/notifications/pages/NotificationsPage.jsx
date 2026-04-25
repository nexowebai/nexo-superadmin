import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertCircle,
  Shield,
  CheckCheck,
  Trash2,
} from "lucide-react";

import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, Tabs, ConfirmModal, SearchEmptyState } from "@components/ui";
import { SearchBar, StatsCard } from "@components/common";
import { useLayout } from "@context";

import { useNotificationsPage } from "../hooks/useNotificationsPage";
import { TAB_OPTIONS } from "../constants/notificationData";
import { NotificationCard, NotificationSkeleton } from "../components/NotificationCard";

import "./NotificationsPage.css";

function NotificationsPage() {
  const { setHeaderProps } = useLayout();
  const {
    loading,
    notifications,
    unreadCount,
    filter,
    setFilter,
    search,
    setSearch,
    handleRead,
    handleDelete,
    handleMarkAllRead,
    handleDeleteAll,
  } = useNotificationsPage();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const hasUnread = unreadCount > 0;
    const hasNotifications = notifications.length > 0;
    const isUnreadFilter = filter === "unread";

    setHeaderProps({
      title: "Audit Center",
      action: hasNotifications ? (
        <Button
          variant="secondary"
          icon={hasUnread ? CheckCheck : Trash2}
          onClick={hasUnread ? handleMarkAllRead : () => setShowClearConfirm(true)}
          className="h-11 px-6 rounded-md font-bold uppercase tracking-wider text-[11px] shadow-sm"
        >
          {hasUnread 
            ? "Mark all read" 
            : (isUnreadFilter ? "Clear unread" : "Clear notifications")}
        </Button>
      ) : null,
    });

    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, unreadCount, notifications.length, handleMarkAllRead, setShowClearConfirm, filter]);

  return (
    <PageContainer className="notifications-v2 pb-12">
      {/* 1. Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          title="System Health"
          value="Healthy"
          icon={Shield}
          color="var(--success)"
        />
      </div>

      {/* 2. Controls & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:max-w-md">
          <SearchBar
            placeholder="Search alerts..."
            value={search}
            onSearch={setSearch}
            className="h-11"
          />
        </div>
        <Tabs options={TAB_OPTIONS} value={filter} onChange={setFilter} />
      </div>

      {/* 3. Notification Feed */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <SearchEmptyState 
            searchTerm={search}
            type={search ? "search" : "filter"}
            onReset={() => {
              setFilter("all");
              setSearch("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleDeleteAll}
        title={filter === "unread" ? "Clear Unread Alerts?" : "Clear All Notifications?"}
        description={
          filter === "unread"
            ? "Are you sure you want to delete only your unread notifications? This will not affect read alerts."
            : "Are you sure you want to permanently delete all notifications from your archive? This action cannot be undone."
        }
        confirmText={filter === "unread" ? "Yes, Clear Unread" : "Yes, Clear All"}
        variant="delete"
      />
    </PageContainer>
  );
}

export default NotificationsPage;
