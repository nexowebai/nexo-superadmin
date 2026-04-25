import React from "react";
import { Bell, ChevronRight } from "lucide-react";
import { Card } from "@components/ui";
import { SkeletonCard } from "@components/ui/Skeleton/Skeleton";
import { MOCK_NOTIFICATIONS } from "../constants/dashboardData";
import NotificationItem from "./NotificationItem";

export default function NotificationCenter({ loading, notifications = [] }) {
  const displayList = notifications.length > 0 ? notifications : MOCK_NOTIFICATIONS;

  return (
    <Card padding="none" className="rounded-md border-[var(--border-base)] bg-[var(--bg-surface)] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 flex items-center justify-between border-b border-[var(--border-base)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--warning-soft)] text-[var(--warning)] flex items-center justify-center border border-[var(--warning-soft)]">
            <Bell size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Active Intelligence</h3>
            <p className="text-[11px] font-black text-[var(--warning)] uppercase tracking-[0.2em] opacity-80">Notification Center</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {loading
          ? [1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24"><SkeletonCard showAvatar /></div>)
          : displayList.map((notif) => (
            <NotificationItem key={notif.id} {...notif} />
          ))}
      </div>

      <button className="p-4 text-center border-t border-[var(--border-base)] hover:bg-[var(--bg-subtle)] transition-colors">
        <span className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          Access Event Log <ChevronRight size={16} />
        </span>
      </button>
    </Card>
  );
}
