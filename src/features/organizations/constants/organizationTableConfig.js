import React from "react";
import { Badge, StatusBadge } from "@components/ui";

export const getOrganizationColumns = (handleAction) => [
  {
    key: "name",
    label: "Organization",
    sortable: true,
  },
  {
    key: "plan",
    label: "Subscription",
    render: (value) => <Badge variant="secondary">{value}</Badge>,
  },
  {
    key: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
  {
    key: "userCount",
    label: "Members",
    align: "center",
  },
  {
    key: "projectCount",
    label: "Projects",
    align: "center",
  },
  {
    key: "actions",
    label: "Operations",
    align: "right",
    render: (_, row) => (
      <div className="flex justify-end gap-2">
        {/* Actions will be injected via OrganizationsTable or handleAction */}
        <button onClick={() => handleAction("update", row)}>Edit</button>
      </div>
    ),
  },
];
