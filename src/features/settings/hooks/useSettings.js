import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { settingsService as systemApi } from '../services/settingsService';
import notify from '@utils/notify';

export function useSystemSettings() {
    return useQuery({
        queryKey: queryKeys.settings.system,
        queryFn: systemApi.getSettings,
        select: (response) => response?.data?.settings || response?.settings || response?.data || null,
        staleTime: 10 * 60 * 1000,
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: systemApi.updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.settings.system });
            notify.success('Settings updated successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to update settings'),
    });
}
