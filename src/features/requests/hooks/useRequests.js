import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { requestsApi } from '../../api/superAdminApi';
import notify from '@utils/notify';

export function useRequests(params = {}) {
    return useQuery({
        queryKey: queryKeys.requests.list(params),
        queryFn: () => requestsApi.getAll(params),
        select: (response) => ({
            requests: response?.data?.requests || response?.requests || [],
            pagination: response?.data?.pagination || response?.pagination || { page: 1, limit: 10, total: 0, pages: 1 },
        }),
    });
}

export function useApproveRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: requestsApi.approve,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            notify.success('Request approved successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to approve request'),
    });
}

export function useRejectRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }) => requestsApi.reject(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
            notify.success('Request rejected');
        },
        onError: (err) => notify.error(err?.message || 'Failed to reject request'),
    });
}
