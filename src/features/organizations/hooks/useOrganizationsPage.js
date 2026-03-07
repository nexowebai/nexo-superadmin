import { useState, useCallback, useMemo } from 'react';
import { useOrganizations, useEnableOrganization, useDeleteOrganization, useUpdateOrganization } from './useOrganizations';
import { MOCK_ORGANIZATIONS } from '../constants/organizationData';
import notify from '@utils/notify';

export function useOrganizationsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [tier, setTier] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const { data, isLoading: loading, refetch } = useOrganizations({
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
        subscription_tier: tier || undefined
    });

    const { mutate: enableOrg } = useEnableOrganization();
    const { mutate: deleteOrg } = useDeleteOrganization();
    const { mutate: updateOrg } = useUpdateOrganization();

    const organizations = useMemo(() => {
        return data?.organizations?.length > 0 ? data.organizations : MOCK_ORGANIZATIONS;
    }, [data]);

    const pagination = data?.pagination || { page, limit: 10, total: organizations.length, pages: 1 };

    const handlePageChange = useCallback((newPage) => setPage(newPage), []);

    const handleAction = useCallback((type, orgId, onSuccess) => {
        const action = type === 'delete' ? deleteOrg : (type === 'enable' ? enableOrg : updateOrg);
        const messages = {
            delete: { loading: 'Deleting organization...', success: 'Organization deleted!', error: 'Failed to delete' },
            enable: { loading: 'Enabling organization...', success: 'Organization enabled!', error: 'Failed to enable' },
            update: { loading: 'Updating status...', success: 'Status updated!', error: 'Failed' },
        };

        notify.promise(
            new Promise((resolve, reject) => {
                const payload = type === 'update' ? { id: orgId.id, data: orgId.data } : orgId;
                action(payload, {
                    onSuccess: () => { onSuccess?.(); refetch(); resolve(); },
                    onError: reject,
                });
            }),
            messages[type] || messages.update
        );
    }, [deleteOrg, enableOrg, updateOrg, refetch]);

    return {
        loading,
        organizations,
        pagination,
        page,
        setPage: handlePageChange,
        search,
        setSearch,
        status,
        setStatus,
        tier,
        setTier,
        dateRange,
        setDateRange,
        handleAction,
        refetch
    };
}
