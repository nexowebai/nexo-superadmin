import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { dashboardApi } from '../../api/superAdminApi';

export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.stats,
        queryFn: dashboardApi.getStats,
        select: (response) => response?.data?.stats || response?.stats || response?.data || null,
        staleTime: 2 * 60 * 1000,
    });
}
