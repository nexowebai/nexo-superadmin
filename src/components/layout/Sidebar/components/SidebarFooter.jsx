import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@lib/cn";

export const SidebarFooter = ({
  user,
  userDisplayName,
  userInitials,
  roleLabel,
  isCollapsed,
  handleLogoutClick,
}) => {
  return (
    <div className="ds-sidebar__footer">
      <div
        className={cn(
          "ds-sidebar__user-card",
          isCollapsed && "ds-sidebar__user-card--collapsed",
        )}
      >
        <div className="ds-sidebar__user-details">
          <div className="ds-sidebar__user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={userDisplayName} />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              className="ds-sidebar__user-meta"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="ds-sidebar__user-name">{userDisplayName}</span>
              <span className="ds-sidebar__user-role">{roleLabel}</span>
            </motion.div>
          )}
        </div>

        {!isCollapsed && (
          <button
            className="ds-sidebar__action-btn logout"
            onClick={handleLogoutClick}
            title="Logout"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};
