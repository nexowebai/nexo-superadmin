import { Mail, Phone } from "lucide-react";
import { StatusBadge } from "@components/ui";
import { TableActions } from "@components/common";
import { formatDate } from "@utils/format";

export const getAdminColumns = ({ navigate, openDeleteModal }) => [
  {
    key: "user_code",
    label: "Code",
    width: 110,
    copyable: true,
    sortable: true,
  },
  {
    key: "full_name",
    label: "Admin",
    minWidth: 200,
    sortable: true,
    render: (_, admin) => (
      <div className="user-cell">
        <div className="user-avatar">{admin.full_name?.charAt(0) || "A"}</div>
        <span className="user-name">
          {admin.full_name ||
            `${admin.first_name || ""} ${admin.last_name || ""}`.trim()}
        </span>
      </div>
    ),
  },
  {
    key: "email",
    label: "Email",
    minWidth: 220,
    sortable: true,
    render: (val) => (
      <div className="icon-text">
        <Mail size={14} />
        <span>{val}</span>
      </div>
    ),
  },
  {
    key: "phone_number",
    label: "Phone",
    width: 150,
    render: (val) =>
      val ? (
        <div className="icon-text">
          <Phone size={14} />
          <span>{val}</span>
        </div>
      ) : (
        "—"
      ),
  },
  {
    key: "is_active",
    label: "Status",
    width: 110,
    align: "center",
    sortable: true,
    render: (val) => <StatusBadge status={val ? "active" : "inactive"} />,
  },
  {
    key: "created_at",
    label: "Created",
    width: 120,
    sortable: true,
    render: (val) => formatDate(val),
  },
  {
    key: "actions",
    label: "Actions",
    width: 150,
    align: "center",
    render: (_, admin) => (
      <TableActions
        onView={() => navigate(`/admins/${admin.id}`)}
        onEdit={() => navigate(`/admins/${admin.id}/edit`)}
        onDelete={() => openDeleteModal(admin)}
      />
    ),
  },
];
