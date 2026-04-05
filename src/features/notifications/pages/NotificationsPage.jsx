import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertCircle,
  Shield,
  CheckCheck,
  Inbox,
  RefreshCw,
} from "lucide-react";

import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, Tabs } from "@components/ui";
import { SearchBar, StatsCard } from "@components/common";
import { useLayout } from "@context";

// Feature-specific
import { useNotificationsPage } from "../hooks/useNotificationsPage";
import { TAB_OPTIONS } from "../constants/notificationData";
import { NotificationCard } from "../components/NotificationCard";

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
  } = useNotificationsPage();

  useEffect(() => {
    setHeaderProps({
      title: "Notification Center",
      action: (
        <Button
          variant="secondary"
          icon={CheckCheck}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="h-11 px-6 rounded-md font-bold uppercase tracking-wider text-[11px] shadow-sm"
        >
          Clear All Unread
        </Button>
      ),
    });
  }, [setHeaderProps, unreadCount, handleMarkAllRead]);

  return (
    <PageContainer className="notifications-v2 pb-12">
      {/* 1. Operational Markers */}
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
          title="System Status"
          value="Healthy"
          icon={Shield}
          color="var(--success)"
        />
      </div>

      {/* 2. Controls & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:max-w-md">
          <SearchBar
            placeholder="Search history..."
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
          <div className="flex flex-col items-center justify-center py-20 bg-surface border border-base rounded-md border-dashed">
            <RefreshCw size={32} className="text-primary animate-spin mb-4" />
            <p className="text-sm font-bold text-muted uppercase tracking-widest">
              Synchronizing alerts...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface border border-base rounded-md border-dashed text-center">
            <div className="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center text-muted mb-6">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">
              Zero Alerts Pending
            </h3>
            <p className="text-sm text-secondary px-6 max-w-sm mb-8">
              You're all caught up! There are no messages matching your criteria
              right now.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
              className="h-10 px-6"
            >
              Reset Filters
            </Button>
          </div>
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
    </PageContainer>
  );
}

export default NotificationsPage;
