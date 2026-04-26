import { useEffect, useRef } from "react";
import { subscribeToNotifications, unsubscribeFromChannel } from "@lib/supabase";

export function useNotificationRealtime({ 
  userId, 
  setNotifications, 
  setUnreadCount, 
  setRealtimeConnected, 
  mountedRef 
}) {
  const channelRef = useRef(null);

  useEffect(() => {
    if (!userId || channelRef.current) return;

    const channel = subscribeToNotifications(userId, {
      onInsert: (newNotification) => {
        if (!mountedRef.current) return;
        setRealtimeConnected(true);
        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [newNotification, ...prev];
        });
        if (!newNotification.is_read) setUnreadCount((prev) => prev + 1);
      },
      onUpdate: (updatedNotification) => {
        if (!mountedRef.current) return;
        setRealtimeConnected(true);
        setNotifications((prev) => {
          const oldNotif = prev.find((n) => n.id === updatedNotification.id);
          if (oldNotif && !oldNotif.is_read && updatedNotification.is_read) {
            setUnreadCount((count) => Math.max(0, count - 1));
          } else if (oldNotif && oldNotif.is_read && !updatedNotification.is_read) {
            setUnreadCount((count) => count + 1);
          }
          return prev.map((n) => n.id === updatedNotification.id ? updatedNotification : n);
        });
      },
      onDelete: (deletedNotification) => {
        if (!mountedRef.current) return;
        setRealtimeConnected(true);
        setNotifications((prev) => prev.filter((n) => n.id !== deletedNotification.id));
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      },
      onConnectionChange: (status) => {
        if (mountedRef.current) setRealtimeConnected(status === "SUBSCRIBED");
      },
    });

    channelRef.current = channel;
  }, [userId, setNotifications, setUnreadCount, setRealtimeConnected, mountedRef]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);
}
