import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrganization, useEnableOrganization, useDeleteOrganization } from './useOrganizations';
import notify from '@utils/notify';

export function useOrganizationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modals, setModals] = useState({ reset: false, disable: false, delete: false });

    const { data: org, isLoading: loading, refetch } = useOrganization(id);
    const { mutate: enableOrg } = useEnableOrganization();
    const { mutate: deleteOrg } = useDeleteOrganization();

    const openModal = useCallback((type) => {
        setModals((prev) => ({ ...prev, [type]: true }));
    }, []);

    const closeModal = useCallback((type) => {
        setModals((prev) => ({ ...prev, [type]: false }));
    }, []);

    const handleEnable = useCallback(() => {
        notify.promise(
            new Promise((resolve, reject) => {
                enableOrg(id, {
                    onSuccess: () => { refetch(); resolve(); },
                    onError: reject,
                });
            }),
            {
                loading: 'Enabling organization...',
                success: 'Organization enabled successfully',
                error: 'Failed to enable organization',
            }
        );
    }, [id, enableOrg, refetch]);

    const handleDelete = useCallback(() => {
        notify.promise(
            new Promise((resolve, reject) => {
                deleteOrg(id, {
                    onSuccess: () => { navigate('/organizations'); resolve(); },
                    onError: reject,
                });
            }),
            {
                loading: 'Deleting organization...',
                success: 'Organization deleted successfully',
                error: 'Failed to delete organization',
            }
        );
    }, [id, deleteOrg, navigate]);

    return {
        org,
        loading,
        modals,
        openModal,
        closeModal,
        handleEnable,
        handleDelete,
        refetch,
        navigate,
    };
}
