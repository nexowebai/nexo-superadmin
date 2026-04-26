import { useState, useCallback } from "react";
import { useOrganizationColumns } from "../components/table/OrgColumns";
import notify from "@utils/notify";
import { exportToCSV, exportToPDF } from "@utils/exportService";

export function useOrganizationsTable({
  data,
  navigate,
  handleAction,
  refetch,
}) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const handleStatusChange = useCallback(
    (org, newStatus) => {
      if (newStatus === org.status) return;
      if (newStatus === "disabled") {
        setSelectedOrg(org);
        setDisableModalOpen(true);
        return;
      }
      handleAction(
        newStatus === "active" && org.status === "disabled"
          ? "enable"
          : "update",
        newStatus === "active" && org.status === "disabled"
          ? org.id
          : { id: org.id, data: { status: newStatus } },
      );
    },
    [handleAction],
  );

  const closeModal = useCallback(() => {
    setModalConfig({ isOpen: false, type: null, data: null });
    setDisableModalOpen(false);
  }, []);

  const columns = useOrganizationColumns({
    navigate,
    handleStatusChange,
    setModalConfig,
    setSelectedOrg,
    setDisableModalOpen,
  });

  const handleExport = useCallback(
    (type) => {
      const fn = type === "csv" ? exportToCSV : exportToPDF;
      fn(
        data,
        columns.filter((c) => c.key !== "actions"),
        type === "csv"
          ? "org_export"
          : { title: "Nexo Organizations", filename: "nexo_org_report" },
      );
      notify.success(`${type.toUpperCase()} Export initiated`);
    },
    [data, columns],
  );

  return {
    columns,
    modalConfig,
    disableModalOpen,
    selectedOrg,
    closeModal,
    handleExport,
    setModalConfig,
    setDisableModalOpen,
    setSelectedOrg,
  };
}

export default useOrganizationsTable;
