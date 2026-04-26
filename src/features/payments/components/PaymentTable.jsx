import React from "react";
import { Receipt } from "lucide-react";
import { DataTable } from "@components/common";
import { Select, SearchEmptyState } from "@components/ui";
import notify from "@utils/notify";
import { STATUS_OPTIONS, PLAN_OPTIONS } from "../constants/paymentData";
import { usePaymentTableColumns } from "./PaymentTableColumns";

export function PaymentTable({
  data, loading, search, onSearchChange,
  status, setStatus, plan, setPlan,
  onRefresh, onViewDetail,
}) {
  const columns = usePaymentTableColumns(onViewDetail);

  return (
    <DataTable
      columns={columns} data={data} loading={loading}
      emptyIcon={Receipt} emptyTitle="No payments found"
      emptyDescription="Try broadening your search or filter criteria"
      showToolbar search={search} onSearchChange={onSearchChange}
      onRefresh={onRefresh} onExportCSV={() => notify.info("Exporting data...")}
      stickyFirstColumn stickyLastColumn
      renderEmpty={
        data.length === 0 && !loading ? (
          <SearchEmptyState
            onReset={() => { onSearchChange(""); setStatus(""); setPlan(""); }}
            searchTerm={search}
            type={search ? "search" : status || plan ? "filter" : "search"}
          />
        ) : null
      }
      filters={
        <>
          <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} placeholder="Status" className="w-40" />
          <Select options={PLAN_OPTIONS} value={plan} onChange={setPlan} placeholder="Plan" className="w-40" />
        </>
      }
    />
  );
}
