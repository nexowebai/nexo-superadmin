export const ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  MANAGER: "manager",
  FIELD_OFFICER: "field-officer",
};

export const ROLE_LABELS = {
  "super-admin": "Super Admin",
  admin: "Admin",
  manager: "Manager",
  "field-officer": "Field Officer",
};

export const ROLE_HIERARCHY = {
  "super-admin": 4,
  admin: 3,
  manager: 2,
  "field-officer": 1,
};

export const hasPermission = (userRole, requiredRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};
