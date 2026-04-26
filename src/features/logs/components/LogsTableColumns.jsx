import { useMemo } from "react";
import { User, Building2, Calendar, Clock, Terminal } from "lucide-react";
import { TableActions } from "@components/common";
import { LevelBadge, TypeBadge } from "../components/LogBadges";

export function useLogTableColumns(onViewDetail) {
  return useMemo(
    () => [
      {
        key: "log_level",
        label: "Level",
        width: 120,
        render: (val) => <LevelBadge level={val} />,
      },
      {
        key: "log_type",
        label: "Category",
        width: 130,
        render: (val) => <TypeBadge type={val} />,
      },
      {
        key: "email",
        label: "Initiator",
        width: 200,
        render: (val) => (
          <div className="flex items-center gap-2 text-primary font-bold text-[13px]">
            <User size={12} className="text-muted/60" />
            <span className="truncate">{val || "System"}</span>
          </div>
        ),
      },
      {
        key: "organization_name",
        label: "Context",
        width: 180,
        render: (val) => (
          <div className="flex items-center gap-2 text-secondary font-bold text-[12px]">
            <Building2 size={12} className="text-muted/60" />
            <span className="truncate">{val || "System"}</span>
          </div>
        ),
      },
      {
        key: "created_at",
        label: "Timestamp",
        width: 180,
        render: (val) => {
          const d = new Date(val);
          return (
            <div className="flex flex-col gap-0.5 opacity-70">
              <div className="flex items-center gap-1.5 text-secondary font-bold text-[11px]">
                <Calendar size={11} className="text-muted" />
                <span>{d.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted font-mono text-[10px] font-bold">
                <Clock size={11} />
                <span>{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              </div>
            </div>
          );
        },
      },
      {
        key: "message",
        label: "Summary",
        minWidth: 350,
        render: (val) => (
          <span className="text-[13px] font-medium text-secondary/80 line-clamp-1">{val}</span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: 100,
        align: "right",
        render: (_, row) => (
          <TableActions
            actions={[
              {
                label: "Audit",
                icon: Terminal,
                variant: "info",
                onClick: () => onViewDetail(row),
              },
            ]}
          />
        ),
      },
    ],
    [onViewDetail],
  );
}
