import { useMemo } from "react";
import { Users, Calendar, Mail } from "lucide-react";
import { TableActions } from "@components/common";
import { formatDate } from "@utils/format";
import { StatusDropdown } from "./StatusDropdown";

export const useOrganizationColumns = ({
  navigate,
  handleStatusChange,
  setModalConfig,
  setSelectedOrg,
  setDisableModalOpen,
}) => {
  return useMemo(
    () => [
      {
        key: "org_code",
        label: "ORG ID",
        width: 100,
        copyable: true,
        sortable: true,
      },
      {
        key: "name",
        label: "Organization Name",
        minWidth: 200,
        sortable: true,
        render: (val) => (
          <div className="flex items-center">
            <span className="text-sm font-black text-primary tracking-tight">
              {val}
            </span>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email Address",
        minWidth: 200,
        sortable: true,
        render: (val) => (
          <div className="flex items-center gap-2 text-secondary font-medium">
            <Mail size={14} className="opacity-40" />
            <span className="truncate">{val || "no-email@nexo.com"}</span>
          </div>
        ),
      },
      {
        key: "subscription_tier",
        label: "Subscription",
        width: 140,
        sortable: true,
        render: (val) => {
          const lowerVal = val ? val.toLowerCase() : "";
          return (
            <span className={"tier-badge-pro tier-badge-pro--" + lowerVal}>
              {val}
            </span>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        width: 180,
        sortable: true,
        render: (val, row) => (
          <StatusDropdown
            value={val}
            onChange={(newStatus) => handleStatusChange(row, newStatus)}
          />
        ),
      },
      {
        key: "users_count",
        label: "Users",
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
        key: "created_at",
        label: "Joined",
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
        key: "actions",
        label: "Actions",
        width: 220, // Increased width for 4 actions
        align: "right",
        sticky: "right",
        render: (_, row) => (
          <TableActions
            onView={() => navigate("/organizations/" + row.id)}
            onEdit={() => navigate("/organizations/" + row.id + "/edit")}
            onTogglePower={() => {
              if (row.status === "disabled") {
                setModalConfig({ type: "enable", data: row, isOpen: true });
              } else {
                setSelectedOrg(row);
                setDisableModalOpen(true);
              }
            }}
            onDelete={() =>
              setModalConfig({ type: "delete", data: row, isOpen: true })
            }
            isPowered={row.status !== "disabled"}
            showPower
          />
        ),
      },
    ],
    [
      navigate,
      handleStatusChange,
      setModalConfig,
      setSelectedOrg,
      setDisableModalOpen,
    ],
  );
};
