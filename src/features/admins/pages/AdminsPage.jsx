import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Mail, Phone } from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { DataTable, StatusBadge, TableActions } from '@components/common';
import { ConfirmModal } from '@components/ui/Modal';
import { useAdmins, useDeleteAdmin } from '../../hooks/';
import { formatDate } from '@utils/format';
import '../css/admins.css';

function AdminsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, admin: null });
    const { setHeaderProps } = useLayout();

    useEffect(() => {
        setHeaderProps({
            title: 'Admins',
            action: (
                <Button icon={Plus} onClick={() => navigate('/admins/create')}>
                    Add Admin
                </Button>
            )
        });
    }, [setHeaderProps, navigate]);

    const { data, isLoading, refetch } = useAdmins({ page, limit, search: search || undefined });
    const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

    const { admins, pagination } = data || { admins: [], pagination: { page: 1, limit, total: 0, pages: 1 } };

    const handlePageChange = useCallback((newPage, newLimit) => {
        if (newLimit !== undefined && newLimit !== limit) {
            setLimit(newLimit);
            setPage(1);
        } else {
            setPage(newPage);
        }
    }, [limit]);

    const handleDeleteConfirm = useCallback(() => {
        if (!deleteModal.admin) return;
        deleteAdmin(deleteModal.admin.id, {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, admin: null });
                refetch();
            },
        });
    }, [deleteModal.admin, deleteAdmin, refetch]);

    const columns = useMemo(() => [
        {
            key: 'user_code',
            label: 'Code',
            width: 110,
            copyable: true,
            sortable: true,
        },
        {
            key: 'full_name',
            label: 'Admin',
            minWidth: 200,
            sortable: true,
            render: (_, admin) => (
                <div className="user-cell">
                    <div className="user-avatar">
                        {admin.full_name?.charAt(0) || 'A'}
                    </div>
                    <span className="user-name">
                        {admin.full_name || `${admin.first_name || ''} ${admin.last_name || ''}`.trim()}
                    </span>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            minWidth: 220,
            sortable: true,
            render: (val) => (
                <div className="icon-text">
                    <Mail size={14} />
                    <span>{val}</span>
                </div>
            ),
        },
        {
            key: 'phone_number',
            label: 'Phone',
            width: 150,
            render: (val) => val ? (
                <div className="icon-text">
                    <Phone size={14} />
                    <span>{val}</span>
                </div>
            ) : '—',
        },
        {
            key: 'is_active',
            label: 'Status',
            width: 110,
            align: 'center',
            sortable: true,
            render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} />,
        },
        {
            key: 'created_at',
            label: 'Created',
            width: 120,
            sortable: true,
            render: (val) => formatDate(val),
        },
        {
            key: 'actions',
            label: 'Actions',
            width: 150,
            align: 'center',
            render: (_, admin) => (
                <TableActions
                    onView={() => navigate(`/admins/${admin.id}`)}
                    onEdit={() => navigate(`/admins/${admin.id}/edit`)}
                    onDelete={() => setDeleteModal({ isOpen: true, admin })}
                />
            ),
        },
    ], [navigate]);

    return (
        <PageContainer>
            <DataTable
                columns={columns}
                data={admins}
                loading={isLoading}
                emptyIcon={Shield}
                emptyTitle="No admins found"
                emptyDescription={search ? 'Try adjusting your search' : 'Create your first admin'}
                storageKey="admins-table"
                stickyFirstColumn
                stickyLastColumn
                onRowClick={(admin) => navigate(`/admins/${admin.id}`)}
                defaultSortKey="created_at"
                defaultSortDir="desc"
                showToolbar
                search={search}
                onSearchChange={setSearch}
                onRefresh={refetch}
                pagination={pagination}
                page={page}
                onPageChange={handlePageChange}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, admin: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Admin"
                description={`Are you sure you want to delete ${deleteModal.admin?.full_name || 'this admin'}? This action cannot be undone.`}
                confirmText="Delete"
                variant="delete"
                loading={isDeleting}
            />
        </PageContainer>
    );
}

export default AdminsPage;
