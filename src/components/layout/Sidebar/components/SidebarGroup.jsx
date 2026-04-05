import { useState, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@lib/cn";
import { collapse, rotate } from "@lib/motion";

export const SidebarGroup = memo(function SidebarGroup({
  label,
  icon: Icon,
  children,
  isCollapsed,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const isChildActive = children?.some?.((child) =>
    location.pathname.startsWith(child.props?.to),
  );

  const handleToggle = useCallback(() => {
    if (!isCollapsed) {
      setIsOpen((prev) => !prev);
    }
  }, [isCollapsed]);

  return (
    <div
      className={cn(
        "ds-sidebar__group",
        isChildActive && "ds-sidebar__group--active",
      )}
    >
      <button
        className="ds-sidebar__group-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="ds-sidebar__link-icon">
          <Icon size={20} />
        </span>
        {!isCollapsed && (
          <>
            <span className="ds-sidebar__link-label">{label}</span>
            <motion.span
              className="ds-sidebar__group-chevron"
              animate={isOpen ? "expanded" : "collapsed"}
              variants={rotate}
            >
              <ChevronDown size={16} />
            </motion.span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isCollapsed && (
          <motion.div
            className="ds-sidebar__group-content"
            variants={collapse}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
