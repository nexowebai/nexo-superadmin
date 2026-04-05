import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Trash2,
  Building2,
} from "lucide-react";
import { Button, Card } from "@components/ui";
import { SkeletonCard } from "@components/ui/Skeleton/Skeleton";
import { MOCK_NOTIFICATIONS } from "../constants/dashboardData";

const NOTIFICATION_ICONS = {
  success: { icon: CheckCircle2, color: "var(--success)" },
  warning: { icon: ShieldAlert, color: "var(--warning)" },
  error: { icon: AlertCircle, color: "var(--error)" },
  primary: { icon: Building2, color: "var(--primary)" },
  default: { icon: Bell, color: "var(--text-muted)" },
};

const ActivityItem = ({ title, subtitle, time, status, type, delay }) => {
  const config = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS["default"];
  const Icon = config.icon;
  const color = config.color;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card padding="md" hover className="notification-item group">
        <div
          className={`notification-item__icon ${status === "unread" ? "is-unread" : "is-read"}`}
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 10%, var(--bg-surface))`,
            color: color,
            borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          <Icon size={16} />
        </div>

        <div className="notification-item__content">
          <h4 className="notification-item__title">{title}</h4>
          <p className="notification-item__subtitle">{subtitle}</p>

          <div className="notification-item__time">
            <Clock size={12} />
            <span>{time} ago</span>
          </div>
        </div>

        <div className="notification-item__actions">
          {status === "unread" && <div className="notification-item__dot" />}
          <button className="notification-item__delete-btn">
            <Trash2 size={12} />
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function NotificationCenter({ loading, notifications = [] }) {
  const displayList =
    notifications.length > 0 ? notifications : MOCK_NOTIFICATIONS;

  return (
    <Card variant="pro" padding="md" className="notification-center-card">
      <div className="notification-header">
        <div className="notification-header__info">
          <div className="notification-header__icon">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="notification-header__title">Notifications</h3>
            <p className="notification-header__subtitle">Recent events</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="notification-header__action"
        >
          View All
        </Button>
      </div>

      <div className="notification-list">
        {loading
          ? [1, 2, 3].map((i) => <SkeletonCard key={i} showAvatar />)
          : displayList.map((notif, i) => (
              <ActivityItem key={notif.id} {...notif} delay={i * 0.05} />
            ))}
      </div>
    </Card>
  );
}
