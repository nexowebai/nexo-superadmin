import { cn } from "@lib/cn";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const TYPE_ICONS = {
  success: { icon: CheckCircle2, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  error: { icon: AlertTriangle, className: "text-error" },
  info: { icon: Info, className: "text-info" },
};

export function NotificationItem({ notification, onMarkAsRead }) {
  const getTypeIcon = (type) => {
    const config = TYPE_ICONS[type] || TYPE_ICONS.info;
    const IconComponent = config.icon;
    return <IconComponent size={18} className={config.className} />;
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div
      className={cn(
        "notification-item",
        !notification.is_read && "unread",
      )}
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
    >
      <div className="notification-icon">
        {getTypeIcon(notification.type)}
      </div>
      <div className="notification-details">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        <span className="notification-time">
          {formatTime(notification.created_at)}
        </span>
      </div>
      {!notification.is_read && <div className="unread-dot" />}
    </div>
  );
}

export default NotificationItem;
