import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Trash2,
  Building2,
} from "lucide-react";
import { Card } from "@components/ui";

const NOTIFICATION_ICONS = {
  success: { icon: CheckCircle2, color: "var(--success)" },
  warning: { icon: ShieldAlert, color: "var(--warning)" },
  error: { icon: AlertCircle, color: "var(--error)" },
  primary: { icon: Building2, color: "var(--primary)" },
  default: { icon: Bell, color: "var(--text-muted)" },
};

const NotificationItem = ({ title, subtitle, status, type }) => {
  const config = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS["default"];
  const Icon = config.icon;
  const color = config.color;

  return (
    <Card
      padding="none"
      className="flex items-center gap-5 p-4 group border border-[var(--border-base)] hover:border-[var(--primary)] hover:bg-[var(--bg-subtle)] hover:shadow-none transition-all cursor-pointer rounded-xl"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-[var(--border-base)] transition-all duration-300"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 10%, var(--bg-surface))`,
          color: color,
        }}
      >
        <Icon size={18} strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-width-0 overflow-hidden">
        <h4 className={`text-[13px] font-black truncate mb-1 uppercase tracking-tight ${status === 'unread' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
          {title}
        </h4>
        <p className="text-[11px] font-bold text-[var(--text-muted)] truncate opacity-70">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0 ml-auto">
        {status === "unread" && <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-soft)] shrink-0" />}
        <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-[var(--text-dimmed)] hover:text-white hover:bg-[var(--error)] transition-all shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
};

export default NotificationItem;
