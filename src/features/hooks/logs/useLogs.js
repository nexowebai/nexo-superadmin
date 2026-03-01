import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { systemApi } from '../../api/superAdminApi';

export function useLogs(params = {}) {
    return useQuery({
        queryKey: queryKeys.logs.list(params),
        queryFn: () => systemApi.getLogs(params),
        select: (response) => ({
            logs: response?.data?.logs || response?.logs || [],
            pagination: response?.data?.pagination || response?.pagination || { page: 1, limit: 20, total: 0, pages: 1 },
        }),
    });
}
