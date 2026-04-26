import { useNavigate } from "react-router-dom";
import { ConfirmModal, Select } from "@components/ui";
import { DataTable } from "@components/common";
import { DisableOrgModal } from "../modals/OrgModals";
import { useOrganizationsTable } from "../../hooks/useOrganizationsTable";
import {
  STATUS_OPTIONS,
  TIER_OPTIONS,
  ORG_TABLE_CONFIG,
} from "../../constants/organizationData";
import "../../styles/org-table.css";

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
  handleAction,
}) {
  const navigate = useNavigate();
  const {
    columns,
    modalConfig,
    disableModalOpen,
    selectedOrg,
    closeModal,
    handleExport,
  } = useOrganizationsTable({ data, navigate, handleAction, refetch });

  return (
    <div className="organizations-table-container">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        {...ORG_TABLE_CONFIG}
        search={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        onExportCSV={() => handleExport("csv")}
        onExportPDF={() => handleExport("pdf")}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        filters={
          <>
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              placeholder="Status"
            />
            <Select
              options={TIER_OPTIONS}
              value={tier}
              onChange={setTier}
              placeholder="Plan"
            />
          </>
        }
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={() => {
          handleAction(modalConfig.type, modalConfig.data.id, closeModal);
        }}
        title={
          modalConfig.type === "delete"
            ? "Delete Organization"
            : "Enable Organization"
        }
        description={`Confirm action for ${modalConfig.data?.name}?`}
        variant={modalConfig.type === "delete" ? "delete" : "success"}
      />

      {selectedOrg && (
        <DisableOrgModal
          isOpen={disableModalOpen}
          onClose={closeModal}
          orgId={selectedOrg.id}
          orgName={selectedOrg.name}
          onSuccess={() => {
            closeModal();
            refetch();
          }}
        />
      )}
    </div>
  );
}
