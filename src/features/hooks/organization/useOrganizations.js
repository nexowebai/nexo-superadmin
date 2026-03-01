import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@lib/queryClient';
import { organizationsApi } from '../../api/superAdminApi';
import notify from '@utils/notify';

export function useOrganizations(params = {}) {
    return useQuery({
        queryKey: queryKeys.organizations.list(params),
        queryFn: () => organizationsApi.getAll(params),
        select: (response) => ({
            organizations: response?.data?.organizations || response?.organizations || [],
            pagination: response?.data?.pagination || response?.pagination || { page: 1, limit: 20, total: 0, pages: 1 },
        }),
    });
}

export function useOrganization(id) {
    return useQuery({
        queryKey: queryKeys.organizations.detail(id),
        queryFn: () => organizationsApi.getById(id),
        enabled: !!id,
        select: (response) => response?.data?.organization || response?.organization || response?.data || null,
    });
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: organizationsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
        },
        onError: (err) => notify.error(err?.message || 'Failed to create organization'),
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => organizationsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(id) });
        },
        onError: (err) => notify.error(err?.message || 'Failed to update organization'),
    });
}

export function useDeleteOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: organizationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            notify.success('Organization deleted successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to delete organization'),
    });
}

export function useEnableOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: organizationsApi.enable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            notify.success('Organization enabled successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to enable organization'),
    });
}

export function useDisableOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }) => organizationsApi.disable(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            notify.success('Organization disabled successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to disable organization'),
    });
}

export function useUpdatePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => organizationsApi.updatePlan(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(id) });
            notify.success('Plan updated successfully');
        },
        onError: (err) => notify.error(err?.message || 'Failed to update plan'),
    });
}

export function useResetOrgPassword() {
    return useMutation({
        mutationFn: ({ id, password }) => organizationsApi.resetAdminPassword(id, password),
        onSuccess: () => notify.success('Admin password reset successfully'),
        onError: (err) => notify.error(err?.message || 'Failed to reset password'),
    });
}
