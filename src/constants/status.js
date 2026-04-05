export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ARCHIVED: "archived",
  APPROVED: "approved",
  REJECTED: "rejected",
  DRAFT: "draft",
  DISABLED: "disabled",
};

export const STATUS_CONFIG = {
  [STATUS.ACTIVE]: {
    label: "Active",
    color: "#10b981",
    variant: "success",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  [STATUS.COMPLETED]: {
    label: "Completed",
    color: "#10b981",
    variant: "success",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  [STATUS.IN_PROGRESS]: {
    label: "In Progress",
    color: "#3b82f6",
    variant: "info",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  [STATUS.INACTIVE]: {
    label: "Inactive",
    color: "#f59e0b",
    variant: "warning",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  [STATUS.ON_HOLD]: {
    label: "On Hold",
    color: "#f59e0b",
    variant: "warning",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  [STATUS.PENDING]: {
    label: "Pending",
    color: "#f59e0b",
    variant: "warning",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  [STATUS.CANCELLED]: {
    label: "Cancelled",
    color: "#ef4444",
    variant: "danger",
    glow: "rgba(239, 68, 68, 0.4)",
    strikeThrough: true,
  },
  [STATUS.REJECTED]: {
    label: "Rejected",
    color: "#ef4444",
    variant: "danger",
    glow: "rgba(239, 68, 68, 0.4)",
  },
  [STATUS.APPROVED]: {
    label: "Approved",
    color: "#10b981",
    variant: "success",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  [STATUS.ARCHIVED]: {
    label: "Archived",
    color: "#64748b",
    variant: "default",
    glow: "rgba(100, 116, 139, 0.4)",
  },
  [STATUS.DRAFT]: {
    label: "Draft",
    color: "#94a3b8",
    variant: "default",
    glow: "rgba(148, 163, 184, 0.4)",
  },
  [STATUS.DISABLED]: {
    label: "Disabled",
    color: "#ef4444",
    variant: "danger",
    glow: "rgba(239, 68, 68, 0.4)",
  },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || {
    label: status,
    color: "#64748b",
    variant: "default",
    glow: "rgba(100, 116, 139, 0.4)",
  };
