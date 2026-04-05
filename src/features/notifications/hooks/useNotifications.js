import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { notificationService as notificationsApi } from '../services/notificationService';
import notify from '@utils/notify';

export function useNotifications(params = {}) {
    return useQuery({
        queryKey: queryKeys.notifications.list(params),
        queryFn: () => notificationsApi.getAll(params),
        select: (response) => ({
            notifications: response?.data?.notifications || response?.notifications || [],
            pagination: response?.data?.pagination || response?.pagination || { page: 1, limit: 10, total: 0, pages: 1 },
        }),
    });
}

export function useNotificationCount() {
    return useQuery({
        queryKey: queryKeys.notifications.count,
        queryFn: notificationsApi.getCount,
        select: (response) => response?.data?.count || response?.count || 0,
        staleTime: 30 * 1000,
    });
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
}

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
            notify.success('All notifications marked as read');
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
}
