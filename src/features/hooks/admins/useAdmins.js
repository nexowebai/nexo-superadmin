import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { adminsApi } from '../../api/superAdminApi';
import notify from '@utils/notify';

export function useAdmins(params = {}) {
    return useQuery({
        queryKey: queryKeys.admins.list(params),
        queryFn: () => adminsApi.getAll(params),
        select: (response) => ({
            admins: response?.data?.admins || response?.admins || [],
            pagination: response?.data?.pagination || response?.pagination || { page: 1, limit: 20, total: 0, pages: 1 },
        }),
    });
}

export function useAdmin(id) {
    return useQuery({
        queryKey: queryKeys.admins.detail(id),
        queryFn: () => adminsApi.getById(id),
        enabled: !!id,
        select: (response) => response?.data?.admin || response?.admin || response?.data || null,
    });
}

export function useCreateAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
            notify.success('Admin created successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to create admin'),
    });
}

export function useUpdateAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => adminsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.admins.detail(id) });
            notify.success('Admin updated successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to update admin'),
    });
}

export function useDeleteAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
            notify.success('Admin deleted successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to delete admin'),
    });
}
