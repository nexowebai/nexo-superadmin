import { memo } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/cn";
import { sidebarItem } from "@lib/motion";

export const SidebarLink = memo(function SidebarLink({
  to,
  icon: Icon,
  label,
  isCollapsed,
  badge,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn("ds-sidebar__link", isActive && "ds-sidebar__link--active")
      }
      onClick={onClick}
    >
      <motion.div className="ds-sidebar__link-content" variants={sidebarItem}>
        <span className="ds-sidebar__link-icon">
          <Icon size={20} />
        </span>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              className="ds-sidebar__link-label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {badge && !isCollapsed && (
          <span className="ds-sidebar__badge">{badge}</span>
        )}
      </motion.div>
    </NavLink>
  );
});
