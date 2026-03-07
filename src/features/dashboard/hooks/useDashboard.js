import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { dashboardApi } from '../../api/superAdminApi';
import { STATS_CONFIG, MOCK_ORGANIZATIONS } from '../constants/dashboardData';
import { formatNumber } from '@utils/format';

export function useDashboard() {
    const { data: rawData, isLoading: loading } = useQuery({
        queryKey: queryKeys.dashboard.stats,
        queryFn: dashboardApi.getStats,
        select: (response) => response?.data?.stats || response?.stats || response?.data || null,
        staleTime: 2 * 60 * 1000,
    });

    const metrics = useMemo(() => {
        const summary = rawData?.summary || [];
        return STATS_CONFIG.map((config, index) => {
            const stat = summary.find(s => s.key === config.key);
            const value = stat?.value ?? 0;
            return {
                ...config,
                value: config.isPercent ? `${value}%` : formatNumber(value),
                trend: config.key !== "system_health" ? Math.floor(Math.random() * 30) - 10 : undefined,
                delay: index * 0.05,
            };
        });
    }, [rawData]);

    const organizations = useMemo(() => {
        return rawData?.organizations || MOCK_ORGANIZATIONS;
    }, [rawData]);

    return {
        metrics,
        organizations,
        loading,
        rawData
    };
}
