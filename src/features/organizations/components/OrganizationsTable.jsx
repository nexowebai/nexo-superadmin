import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FolderKanban, Calendar } from 'lucide-react';
import { ConfirmModal } from '@components/ui';
import { DataTable, StatusBadge, TableActions, Select } from '@components/common';
import { useEnableOrganization, useDeleteOrganization } from '../../hooks/';
import { formatDate } from '@utils/format';
import { exportToCSV, exportToPDF } from '@utils/exportService';
import { DisableOrgModal } from './OrgModals';
import notify from '@utils/notify';
import '../css/organizations.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'pending', label: 'Pending' },
];

const TIER_OPTIONS = [
  { value: '', label: 'All Plans' },
  { value: 'basic', label: 'Basic' },
  { value: 'professional', label: 'Professional' },
  { value: 'enterprise', label: 'Enterprise' },
];

export default function OrganizationsTable({
  data,
  loading,
  refetch,
  page,
  pagination,
  onPageChange,
  search,
  setSearch,
  status,
  setStatus,
  tier,
  setTier,
  dateRange,
}) {
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const { mutate: enableOrg } = useEnableOrganization();
  const { mutate: deleteOrg } = useDeleteOrganization();

  const organizations = data || [];

  const columns = useMemo(() => [
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
              <span className="org-cell__id">#{org.id}</span>
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
      width: 120,
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
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
      width: 180,
      align: 'center',
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
  ], [navigate]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(organizations, columns.filter((c) => c.key !== 'actions'), 'organizations_export');
    notify.success('CSV Export initiated');
  }, [organizations, columns]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(organizations, columns.filter((c) => c.key !== 'actions'), {
      title: 'DataStride Admin',
      subtitle: 'Organizations Report',
      dateRange: dateRange?.startDate
        ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate || new Date())}`
        : 'All Time',
      filename: 'organizations_report',
    });
    notify.success('PDF Export initiated');
  }, [organizations, columns, dateRange]);

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null, data: null });
    setDisableModalOpen(false);
    setSelectedOrg(null);
  };

  const handleConfirmAction = useCallback(() => {
    const { type, data: row } = modalConfig;
    if (!row) return;

    const action = type === 'delete' ? deleteOrg : enableOrg;
    const messages = {
      delete: { loading: 'Deleting organization...', success: 'Organization deleted!', error: 'Failed to delete' },
      enable: { loading: 'Enabling organization...', success: 'Organization enabled!', error: 'Failed to enable' },
    };

    notify.promise(
      new Promise((resolve, reject) => {
        action(row.id, {
          onSuccess: () => { closeModal(); refetch(); resolve(); },
          onError: reject,
        });
      }),
      messages[type]
    );
  }, [modalConfig, deleteOrg, enableOrg, refetch]);

  const handlePageChange = useCallback((newPage, newLimit) => {
    if (newLimit && newLimit !== pagination?.limit) {
      onPageChange(1, newLimit);
    } else {
      onPageChange(newPage, pagination?.limit);
    }
  }, [onPageChange, pagination?.limit]);

  return (
    <div className="organizations-table-container">
      <DataTable
        columns={columns}
        data={organizations}
        loading={loading}
        emptyIcon={Building2}
        emptyTitle="No organizations found"
        emptyDescription={search ? 'Try adjusting your search' : 'Create your first organization'}
        storageKey="organizations-table"
        stickyFirstColumn
        stickyLastColumn
        onRowClick={(org) => navigate(`/organizations/${org.id}`)}
        showToolbar
        fileName="organizations_report"
        search={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        filters={
          <>
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(v) => { setStatus(v); handlePageChange(1); }}
              placeholder="Status"
            />
            <Select
              options={TIER_OPTIONS}
              value={tier}
              onChange={(v) => { setTier(v); handlePageChange(1); }}
              placeholder="Plan"
            />
          </>
        }
        pagination={pagination}
        page={page}
        onPageChange={handlePageChange}
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        title={modalConfig.type === 'delete' ? 'Delete Organization' : 'Enable Organization'}
        description={
          modalConfig.type === 'delete'
            ? `Are you sure you want to delete ${modalConfig.data?.name}? This action cannot be undone.`
            : `Enable ${modalConfig.data?.name}?`
        }
        confirmText={modalConfig.type === 'delete' ? 'Delete' : 'Enable'}
        variant={modalConfig.type === 'delete' ? 'delete' : 'success'}
        cancelText="Cancel"
      />

      {selectedOrg && (
        <DisableOrgModal
          isOpen={disableModalOpen}
          onClose={closeModal}
          orgId={selectedOrg.id}
          orgName={selectedOrg.name}
          onSuccess={() => { closeModal(); refetch(); }}
        />
      )}
    </div>
  );
}
