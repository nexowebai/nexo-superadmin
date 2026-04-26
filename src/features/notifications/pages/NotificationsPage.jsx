import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Bell, AlertCircle, Shield, CheckCheck, Trash2 } from "lucide-react";
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
    loading, notifications, unreadCount, filter, setFilter,
    search, setSearch, handleRead, handleDelete,
    handleMarkAllRead, handleDeleteAll,
  } = useNotificationsPage();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHeaderProps({
      title: "Audit Center",
      action: notifications.length > 0 ? (
        <HeaderAction 
          unreadCount={unreadCount} filter={filter} 
          onMarkRead={handleMarkAllRead} 
          onClear={() => setShowClearConfirm(true)} 
        />
      ) : null,
    });
    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, unreadCount, notifications.length, handleMarkAllRead, filter]);

  return (
    <PageContainer className="notifications-v2 pb-12">
      <NotificationsStats count={notifications.length} unread={unreadCount} />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:max-w-md">
          <SearchBar placeholder="Search alerts..." value={search} onSearch={setSearch} className="h-11" />
        </div>
        <Tabs options={TAB_OPTIONS} value={filter} onChange={setFilter} />
      </div>

      <div className="min-h-[400px]">
        <NotificationFeed 
          loading={loading} notifications={notifications} 
          search={search} setFilter={setFilter} setSearch={setSearch}
          onRead={handleRead} onDelete={handleDelete}
        />
      </div>

      <ClearConfirmModal 
        isOpen={showClearConfirm} filter={filter}
        onClose={() => setShowClearConfirm(false)} onConfirm={handleDeleteAll} 
      />
    </PageContainer>
  );
}

function HeaderAction({ unreadCount, filter, onMarkRead, onClear }) {
  const hasUnread = unreadCount > 0;
  return (
    <Button
      variant="secondary" icon={hasUnread ? CheckCheck : Trash2} onClick={hasUnread ? onMarkRead : onClear}
      className="h-11 px-6 rounded-md font-bold uppercase tracking-wider text-[11px] shadow-sm"
    >
      {hasUnread ? "Mark all read" : filter === "unread" ? "Clear unread" : "Clear notifications"}
    </Button>
  );
}

function NotificationsStats({ count, unread }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard title="Total Notifications" value={count} icon={Bell} color="var(--primary)" />
      <StatsCard title="Unread Alerts" value={unread} icon={AlertCircle} color="var(--error)" />
      <StatsCard title="System Health" value="Healthy" icon={Shield} color="var(--success)" />
    </div>
  );
}

function NotificationFeed({ loading, notifications, search, setFilter, setSearch, onRead, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <NotificationSkeleton key={i} />)}
      </div>
    );
  }
  if (notifications.length === 0) {
    return (
      <SearchEmptyState
        searchTerm={search} type={search ? "search" : "filter"}
        onReset={() => { setFilter("all"); setSearch(""); }}
      />
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <NotificationCard key={notif.id} notification={notif} onRead={onRead} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ClearConfirmModal({ isOpen, onClose, onConfirm, filter }) {
  const isUnread = filter === "unread";
  return (
    <ConfirmModal
      isOpen={isOpen} onClose={onClose} onConfirm={onConfirm}
      title={isUnread ? "Clear Unread Alerts?" : "Clear All Notifications?"}
      description={isUnread 
        ? "Are you sure you want to delete only your unread notifications? This will not affect read alerts."
        : "Are you sure you want to permanently delete all notifications from your archive? This action cannot be undone."}
      confirmText={isUnread ? "Yes, Clear Unread" : "Yes, Clear All"}
      variant="delete"
    />
  );
}

export default NotificationsPage;
