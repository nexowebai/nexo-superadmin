import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '@components/ui';
import { DataTable } from '@components/common';
import { Select } from '@components/ui';
import { exportToCSV, exportToPDF } from '@utils/exportService';
import { DisableOrgModal } from './OrgModals';
import { useOrganizationColumns } from './OrgColumns';
import { STATUS_OPTIONS, TIER_OPTIONS, ORG_TABLE_CONFIG } from '../constants/organizationData';
import notify from '@utils/notify';
import '../css/organizations.css';

export default function OrganizationsTable({
  data, loading, refetch, page, pagination, onPageChange,
  search, setSearch, status, setStatus, tier, setTier, handleAction
}) {
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const handleStatusChange = useCallback((org, newStatus) => {
    if (newStatus === org.status) return;
    if (newStatus === 'disabled') { setSelectedOrg(org); setDisableModalOpen(true); return; }
    handleAction(newStatus === 'active' && org.status === 'disabled' ? 'enable' : 'update',
      newStatus === 'active' && org.status === 'disabled' ? org.id : { id: org.id, data: { status: newStatus } });
  }, [handleAction]);

  const columns = useOrganizationColumns({ navigate, handleStatusChange, setModalConfig, setSelectedOrg, setDisableModalOpen });

  const handleExport = (type) => {
    const fn = type === 'csv' ? exportToCSV : exportToPDF;
    fn(data, columns.filter(c => c.key !== 'actions'), type === 'csv' ? 'org_export' : { title: 'Nexo Organizations', filename: 'nexo_org_report' });
    notify.success(`${type.toUpperCase()} Export initiated`);
  };

  const closeModal = () => { setModalConfig({ isOpen: false, type: null, data: null }); setDisableModalOpen(false); };

  return (
    <div className="organizations-table-container">
      <DataTable
        columns={columns} data={data} loading={loading} {...ORG_TABLE_CONFIG}
        search={search} onSearchChange={setSearch} onRefresh={refetch}
        onExportCSV={() => handleExport('csv')} onExportPDF={() => handleExport('pdf')}
        pagination={pagination} page={page} onPageChange={onPageChange}
        filters={
          <>
            <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} placeholder="Status" />
            <Select options={TIER_OPTIONS} value={tier} onChange={setTier} placeholder="Plan" />
          </>
        }
      />
      <ConfirmModal
        isOpen={modalConfig.isOpen} onClose={closeModal}
        onConfirm={() => { handleAction(modalConfig.type, modalConfig.data.id, closeModal); }}
        title={modalConfig.type === 'delete' ? 'Delete Organization' : 'Enable Organization'}
        description={`Confirm action for ${modalConfig.data?.name}?`}
        variant={modalConfig.type === 'delete' ? 'delete' : 'success'}
      />
      {selectedOrg && <DisableOrgModal isOpen={disableModalOpen} onClose={closeModal} orgId={selectedOrg.id} orgName={selectedOrg.name} onSuccess={() => { closeModal(); refetch(); }} />}
    </div>
  );
}
