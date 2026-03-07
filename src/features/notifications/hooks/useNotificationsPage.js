import { useState, useMemo, useCallback } from 'react';
import {
    useNotifications, useMarkAsRead, useMarkAllAsRead,
    useDeleteNotification, useNotificationCount
} from './useNotifications';
import { MOCK_NOTIFICATIONS } from '../constants/notificationData';
import notify from '@utils/notify';

export function useNotificationsPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const {
        data: realData,
        isLoading: loading,
        refetch,
    } = useNotifications({
        page,
        limit,
        unreadOnly: filter === 'unread' ? true : undefined,
        search: search || undefined
    });

    const { data: unreadCount = 0 } = useNotificationCount();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();
    const { mutate: deleteNotification } = useDeleteNotification();

    const notifications = useMemo(() => {
        const raw = realData?.notifications?.length > 0 ? realData.notifications : MOCK_NOTIFICATIONS;
        return raw.filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.message.toLowerCase().includes(search.toLowerCase())
        );
    }, [realData, search]);

    const handleMarkAllRead = useCallback(() => {
        notify.promise(
            new Promise((resolve, reject) => {
                markAllAsRead(null, {
                    onSuccess: () => { refetch(); resolve(); },
                    onError: reject
                });
            }),
            {
                loading: 'Cleaning up...',
                success: 'All caught up!',
                error: 'Failed to clear notifications'
            }
        );
    }, [markAllAsRead, refetch]);

    const handleRead = useCallback((id) => markAsRead(id, { onSuccess: refetch }), [markAsRead, refetch]);
    const handleDelete = useCallback((id) => deleteNotification(id, { onSuccess: refetch }), [deleteNotification, refetch]);

    return {
        loading,
        notifications,
        unreadCount,
        filter,
        setFilter,
        search,
        setSearch,
        page,
        setPage,
        handleRead,
        handleDelete,
        handleMarkAllRead,
        refetch
    };
}
