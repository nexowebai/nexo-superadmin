import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  UserPlus,
  Shield,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "@lib/cn";
import { formatDate, formatRelativeTime } from "@utils/format";

export function NotificationCard({ notification, onRead, onDelete }) {
  const config = {
    success: { color: "var(--success)", icon: CheckCircle2, label: "Success" },
    warning: { color: "var(--warning)", icon: AlertTriangle, label: "Warning" },
    error: { color: "var(--error)", icon: AlertCircle, label: "Alert" },
    info: { color: "var(--info)", icon: Info, label: "Info" },
    user: { color: "var(--primary)", icon: UserPlus, label: "User" },
    security: { color: "var(--error)", icon: Shield, label: "Security" },
  };

  const {
    color = "var(--text-muted)",
    icon: Icon = Bell,
    label: typeLabel,
  } = config[notification.type] || {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn("notif-card", notification.is_read && "notif-card--read")}
      style={{
        backgroundColor: `color-mix(in srgb, ${color}, var(--bg-surface) 96%)`,
        borderColor: `color-mix(in srgb, ${color}, transparent 60%)`,
        borderRadius: "var(--radius-md)",
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: `color-mix(in srgb, ${color}, transparent 88%)`,
            color,
            borderColor: `color-mix(in srgb, ${color}, transparent 70%)`,
          }}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold text-primary m-0 tracking-tight leading-snug line-clamp-1">
              {notification.title}
            </h3>
            {!notification.is_read && (
              <span className="shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5 shadow-[0_0_8px_var(--primary)]" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[10px] font-black uppercase tracking-wider opacity-60"
              style={{ color }}
            >
              {typeLabel}
            </span>
            <span className="w-1 h-1 bg-muted rounded-full opacity-30" />
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-[13px] font-normal text-secondary/80 leading-relaxed flex-1 m-0 mb-6">
        {notification.message}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-base mt-auto">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">
          <Clock size={11} />
          <span>{formatDate(notification.created_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          {!notification.is_read && (
            <button
              className="notif-btn-pro notif-btn-read-pro h-8 px-4"
              onClick={() => onRead(notification.id)}
            >
              {" "}
              Mark Read
            </button>
          )}
          <button
            className="w-9 h-9 rounded-md  hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-all duration-200 border border-rose-100 hover:border-rose-600 relative z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            title="Delete Notification"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="notif-card p-6 border border-base rounded-md opacity-60 pointer-events-none">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-md bg-slate-100 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 animate-pulse rounded-full w-2/3" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-full w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-6 flex-1">
        <div className="h-3 bg-slate-100 animate-pulse rounded-full w-full" />
        <div className="h-3 bg-slate-100 animate-pulse rounded-full w-5/6" />
      </div>
      <div className="pt-4 border-t border-base flex justify-between items-center">
        <div className="h-3 bg-slate-100 animate-pulse rounded-full w-1/4" />
        <div className="flex gap-2">
          <div className="w-16 h-8 bg-slate-100 animate-pulse rounded-md" />
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
