import React, { useMemo } from "react";
import { Building2, Clock, Eye, Download, Receipt } from "lucide-react";
import { DataTable, TableActions } from "@components/common";
import { StatusBadge, Select } from "@components/ui";
import { formatCurrency, formatDate } from "@utils/format";
import notify from "@utils/notify";
import { STATUS_OPTIONS, PLAN_OPTIONS } from "../constants/paymentData";
import { cn } from "@lib/cn";

export function PaymentTable({
  data,
  loading,
  search,
  onSearchChange,
  status,
  setStatus,
  plan,
  setPlan,
  onRefresh,
  onViewDetail,
}) {
  const columns = useMemo(
    () => [
      {
        key: "invoice_id",
        label: "Invoice #",
        width: 140,
        render: (val) => (
          <span className="font-mono text-[11px] font-bold text-muted">
            {val}
          </span>
        ),
      },
      {
        key: "organization_name",
        label: "Organization",
        width: 280,
        sortable: true,
        render: (val) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-surface-base border border-base flex items-center justify-center text-muted/60">
              <Building2 size={14} />
            </div>
            <span className="font-bold text-primary text-[13px]">{val}</span>
          </div>
        ),
      },
      {
        key: "plan",
        label: "Plan",
        width: 140,
        render: (val) => {
          const planLower = val.toLowerCase();
          let planClass = "bg-surface-elevated text-secondary";
          if (planLower === "enterprise")
            planClass = "bg-primary/10 text-primary border-primary/20";
          if (planLower === "professional")
            planClass = "bg-info/10 text-info border-info/20";
          if (planLower === "premium")
            planClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";

          return (
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                planClass,
              )}
            >
              {val}
            </span>
          );
        },
      },
      {
        key: "amount",
        label: "Amount",
        width: 140,
        sortable: true,
        render: (val) => (
          <span className="font-black text-primary tabular-nums">
            {formatCurrency(val)}
          </span>
        ),
      },
      {
        key: "created_at",
        label: "Date",
        width: 150,
        sortable: true,
        render: (val) => (
          <div className="flex items-center gap-1.5 opacity-60">
            <Clock size={11} />
            <span className="text-[11px] font-bold">{formatDate(val)}</span>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        width: 140,
        render: (val) => <StatusBadge status={val} size="sm" />,
      },
      {
        key: "actions",
        label: "Actions",
        width: 120,
        align: "right",
        render: (_, row) => (
          <TableActions
            actions={[
              {
                label: "Details",
                icon: Eye,
                variant: "info",
                onClick: () => onViewDetail(row),
              },
              {
                label: "Download",
                icon: Download,
                variant: "success",
                onClick: () => notify.info("Downloading PDF..."),
              },
            ]}
          />
        ),
      },
    ],
    [onViewDetail],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyIcon={Receipt}
      emptyTitle="No payments found"
      emptyDescription="Try broadening your search or filter criteria"
      showToolbar
      search={search}
      onSearchChange={onSearchChange}
      onRefresh={onRefresh}
      onExportCSV={() => notify.info("Exporting data...")}
      filters={
        <>
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            placeholder="Status"
            className="w-40"
          />
          <Select
            options={PLAN_OPTIONS}
            value={plan}
            onChange={setPlan}
            placeholder="Plan"
            className="w-40"
          />
        </>
      }
    />
  );
}
