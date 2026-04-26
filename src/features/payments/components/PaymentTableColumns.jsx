import { useMemo } from "react";
import { Clock, Eye, Download } from "lucide-react";
import { TableActions } from "@components/common";
import { StatusBadge } from "@components/ui";
import { formatCurrency, formatDate } from "@utils/format";
import notify from "@utils/notify";
import { cn } from "@lib/cn";

export function usePaymentTableColumns(onViewDetail) {
  return useMemo(
    () => [
      {
        key: "invoice_id",
        label: "Invoice #",
        width: 140,
        render: (val) => <span className="font-mono text-[11px] font-bold text-muted">{val}</span>,
      },
      {
        key: "organization_name",
        label: "Organization",
        width: 320,
        sortable: true,
        render: (val) => <span className="font-bold text-primary text-[13px]">{val}</span>,
      },
      {
        key: "plan",
        label: "Plan",
        width: 160,
        render: (val) => {
          const planLower = val.toLowerCase();
          let planClass = "bg-surface-elevated text-secondary";
          if (planLower === "enterprise") planClass = "bg-primary/10 text-primary border-primary/20";
          if (planLower === "professional") planClass = "bg-info/10 text-info border-info/20";
          if (planLower === "premium") planClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";

          return (
            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", planClass)}>
              {val}
            </span>
          );
        },
      },
      {
        key: "amount",
        label: "Amount",
        width: 180,
        sortable: true,
        render: (val) => <span className="font-black text-primary tabular-nums">{formatCurrency(val)}</span>,
      },
      {
        key: "created_at",
        label: "Date",
        width: 180,
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
        width: 60,
        align: "right",
        render: (_, row) => (
          <TableActions
            actions={[
              { label: "Details", icon: Eye, variant: "info", onClick: () => onViewDetail(row) },
              { label: "Download", icon: Download, variant: "success", onClick: () => notify.info("Downloading PDF...") },
            ]}
          />
        ),
      },
    ],
    [onViewDetail],
  );
}
