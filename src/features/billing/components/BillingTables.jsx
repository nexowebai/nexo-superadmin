import { useMemo } from "react";
import { Copy, Eye, Trash2 } from "lucide-react";
import { DataTable, TableActions } from "@components/common";
import { StatusBadge } from "@components/ui";

export function BillingTables({ activeTab, plans, coupons, onCopy, onViewPlan, onDeletePlan, onViewCoupon, onDeleteCoupon }) {
  const planColumns = useMemo(
    () => [
      {
        key: "name",
        label: "Plan Name",
        render: (val) => (
          <span className="font-bold text-primary text-[14px]">{val}</span>
        ),
      },
      {
        key: "price",
        label: "Pricing",
        render: (val, row) => (
          <span className="font-bold text-secondary">
            {typeof val === "number" ? `$${val} / ${row.billing_cycle}` : val}
          </span>
        ),
      },
      {
        key: "limits",
        label: "Project Limits",
        render: (_, row) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-black text-primary">
              Base: {row.base_projects} Projects
            </span>
            {row.extra_project_cost > 0 && (
              <span className="text-[10px] font-bold text-muted uppercase italic opacity-70">
                Extra: ${row.extra_project_cost}/project
              </span>
            )}
          </div>
        ),
      },
      {
        key: "features",
        label: "Key Features",
        render: (val) => (
          <span className="text-secondary text-xs font-medium truncate max-w-[200px] block opacity-80">
            {val}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (val) => <StatusBadge status={val} size="sm" />,
      },
      {
        key: "actions",
        label: "Actions",
        width: 100,
        align: "right",
        render: (_, row) => (
          <TableActions
            actions={[
              { label: "View", icon: Eye, variant: "primary", onClick: () => onViewPlan(row) },
              { label: "Delete", icon: Trash2, variant: "danger", onClick: () => onDeletePlan(row) },
            ]}
          />
        ),
      },
    ],
    [onViewPlan, onDeletePlan],
  );

  const couponColumns = useMemo(
    () => [
      {
        key: "code",
        label: "Coupon Code",
        render: (val) => (
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-primary text-[13px] bg-surface-subtle px-2 py-1 rounded border border-base">
              {val}
            </span>
            <button
              onClick={() => onCopy(val)}
              className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:text-primary hover:bg-surface-elevated transition-all"
            >
              <Copy size={14} />
            </button>
          </div>
        ),
      },
      {
        key: "value",
        label: "Discount",
        render: (val, row) => (
          <span className="font-black text-secondary tabular-nums">
            {row.type === "percentage" ? `${val}% OFF` : `$${val} OFF`}
          </span>
        ),
      },
      {
        key: "duration",
        label: "Duration",
        render: (val) => (
          <span className="capitalize text-xs font-bold text-muted">{val}</span>
        ),
      },
      {
        key: "redemptions",
        label: "Redeemed",
        render: (val) => (
          <span className="font-bold text-secondary text-xs">{val} times</span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (val) => <StatusBadge status={val} size="sm" />,
      },
      {
        key: "actions",
        label: "Actions",
        width: 100,
        align: "right",
        render: (_, row) => (
          <TableActions
            actions={[
              { label: "View", icon: Eye, variant: "primary", onClick: () => onViewCoupon(row) },
              { label: "Delete", icon: Trash2, variant: "danger", onClick: () => onDeleteCoupon(row) },
            ]}
          />
        ),
      },
    ],
    [onCopy, onViewCoupon, onDeleteCoupon],
  );

  return (
    <div className="card-pro p-0 overflow-hidden bg-surface border border-base rounded-md shadow-sm">
      {activeTab === "plans" ? (
        <DataTable
          data={plans}
          columns={planColumns}
          emptyTitle="No Plans Created"
        />
      ) : (
        <DataTable
          data={coupons}
          columns={couponColumns}
          emptyTitle="No Coupons Active"
        />
      )}
    </div>
  );
}
