import { useMemo } from "react";
import {
  Building2,
  Mail,
  Calendar,
  MessageSquare,
  Eye,
  Check,
  X as XIcon,
} from "lucide-react";
import { StatusBadge } from "@components/ui";
import { TableActions } from "@components/common";
import { formatDate } from "@utils/format";

export const useRequestColumns = ({
  handleApprove,
  setRejectModal,
  setDetailModal,
}) => {
  return useMemo(
    () => [
      {
        key: "organization_name",
        label: "Organization Name",
        width: 250,
        sortable: true,
        render: (val) => (
          <div className="flex items-center gap-3">
            <div className="org-icon-sq">
              <Building2 size={16} />
            </div>
            <span className="font-bold text-primary">{val}</span>
          </div>
        ),
      },
      {
        key: "contact_email",
        label: "Contact Email",
        width: 200,
        render: (val) => (
          <div className="flex items-center gap-2 text-secondary">
            <Mail size={14} className="text-muted" />
            <span>{val}</span>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        width: 150,
        render: (val) => <StatusBadge status={val} />,
      },
      {
        key: "created_at",
        label: "Requested At",
        width: 180,
        render: (val) => (
          <div className="date-pill flex gap-2 items-center">
            <Calendar size={12} />
            <span>{formatDate(val)}</span>
          </div>
        ),
      },
      {
        key: "message",
        label: "Request Message",
        width: 300,
        render: (val) =>
          val ? (
            <div className="flex items-start gap-2 max-w-[280px]">
              <MessageSquare size={14} className="text-muted mt-1 shrink-0" />
              <span className="text-sm text-secondary truncate font-medium" title={val}>
                {val}
              </span>
            </div>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
      {
        key: "actions",
        label: "Actions",
        width: 140,
        align: "right",
        render: (_, row) => {
          const actions = [];
          actions.push({
            label: "View Details",
            icon: Eye,
            variant: "primary",
            onClick: () => setDetailModal({ isOpen: true, request: row }),
          });

          if (row.status === "pending") {
            actions.push({
              label: "Approve",
              icon: Check,
              variant: "success",
              onClick: () => handleApprove(row),
            });
            actions.push({
              label: "Reject",
              icon: XIcon,
              variant: "danger",
              onClick: () => setRejectModal({ isOpen: true, request: row }),
            });
          }

          return <TableActions actions={actions} />;
        },
      },
    ],
    [handleApprove, setRejectModal, setDetailModal],
  );
};
