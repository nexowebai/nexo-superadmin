import { Skeleton } from "@components/ui/Skeleton/Skeleton";

export function NotificationSkeleton() {
  return (
    <div className="notification-list">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="notification-item">
          <Skeleton width="36px" height="36px" borderRadius="50%" />
          <div className="notification-details" style={{ flex: 1 }} /* allowed-inline */>
            <Skeleton width="70%" height="14px" />
            <Skeleton width="90%" height="12px" className="mt-1.5" />
            <Skeleton width="60px" height="10px" className="mt-1.5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;
