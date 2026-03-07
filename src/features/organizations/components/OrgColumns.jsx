import { useMemo } from 'react';
import { Building2, Users, FolderKanban, Calendar } from 'lucide-react';
import { TableActions } from '@components/common';
import { formatDate } from '@utils/format';
import { StatusDropdown } from './StatusDropdown';

export const useOrganizationColumns = ({ navigate, handleStatusChange, setModalConfig, setSelectedOrg, setDisableModalOpen }) => {
    return useMemo(() => [
        {
            key: 'org_code',
            label: 'ORG ID',
            width: 110,
            copyable: true,
            sortable: true,
        },
        {
            key: 'name',
            label: 'Organization Details',
            minWidth: 320,
            sortable: true,
            render: (_, org) => (
                <div className="org-cell">
                    <div className="org-cell__logo">
                        {org.logo ? (
                            <img src={org.logo} alt="" />
                        ) : (
                            <Building2 size={18} strokeWidth={2.5} />
                        )}
                    </div>
                    <div className="org-cell__info">
                        <span className="org-cell__name">{org.name}</span>
                        <span className="org-cell__meta">
                            <span className="org-cell__id">#{org.org_code || org.id}</span>
                            <span className="org-cell__dot" />
                            <span className="org-cell__email">{org.email || 'no-email@nexo.com'}</span>
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'subscription_tier',
            label: 'Subscription',
            width: 140,
            sortable: true,
            render: (val) => (
                <span className={`tier-badge-pro tier-badge-pro--${val?.toLowerCase()}`}>
                    {val}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: 180,
            sortable: true,
            render: (val, row) => (
                <StatusDropdown
                    value={val}
                    onChange={(newStatus) => handleStatusChange(row, newStatus)}
                />
            ),
        },
        {
            key: 'users_count',
            label: 'Users',
            width: 90,
            sortable: true,
            render: (val) => (
                <div className="stat-pill">
                    <Users size={12} />
                    <span>{val || 0}</span>
                </div>
            ),
        },
        {
            key: 'projects_count',
            label: 'Projects',
            width: 100,
            sortable: true,
            render: (val) => (
                <div className="stat-pill">
                    <FolderKanban size={12} />
                    <span>{val || 0}</span>
                </div>
            ),
        },
        {
            key: 'created_at',
            label: 'Joined',
            width: 130,
            sortable: true,
            render: (val) => (
                <div className="date-pill">
                    <Calendar size={12} />
                    <span>{formatDate(val)}</span>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            width: 240,
            align: 'right',
            render: (_, row) => (
                <TableActions
                    onView={() => navigate(`/organizations/${row.id}`)}
                    onEdit={() => navigate(`/organizations/${row.id}/edit`)}
                    onTogglePower={() => {
                        if (row.status === 'disabled') {
                            setModalConfig({ type: 'enable', data: row, isOpen: true });
                        } else {
                            setSelectedOrg(row);
                            setDisableModalOpen(true);
                        }
                    }}
                    onDelete={() => setModalConfig({ type: 'delete', data: row, isOpen: true })}
                    isPowered={row.status !== 'disabled'}
                    showPower
                />
            ),
        },
    ], [navigate, handleStatusChange, setModalConfig, setSelectedOrg, setDisableModalOpen]);
};
