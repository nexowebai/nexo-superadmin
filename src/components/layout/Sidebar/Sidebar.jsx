import { useState, useCallback, memo, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  X,
  LayoutGrid,
  Building2,
  Users,
  Settings,
  Bell,
  LineChart,
  FileText,
  ShieldAlert,
  LogOut,
  CreditCard,
  Briefcase,
  FolderOpen,
  ListChecks,
  Heart,
  Timer,
  Trash2,
} from "lucide-react";
import { ConfirmModal } from "@components/ui/Modal";
import { cn } from "@lib/cn";
import { slideInFromLeft, collapse, rotate, sidebarItem } from "@lib/motion";
import nexoFull from "@assets/logo/nexo-full.png";
import nexo from "@assets/logo/nexo.png";
import { ROLE_LABELS } from "@constants/roles";
import "./Sidebar.css";

const SidebarLink = memo(function SidebarLink({
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

const SidebarGroup = memo(function SidebarGroup({
  label,
  icon: Icon,
  children,
  isCollapsed,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const isChildActive = children?.some?.((child) =>
    location.pathname.startsWith(child.props?.to)
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
        isChildActive && "ds-sidebar__group--active"
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

function Sidebar({
  role = "super-admin",
  user = { name: "John Doe", email: "john@example.com" },
  onLogout,
  isOpen = false,
  onClose,
}) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    console.log("Sidebar isOpen changed:", isOpen);
    console.log("onClose function:", typeof onClose);
  }, [isOpen, onClose]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    console.log("Close button clicked");
    if (onClose) {
      console.log("Calling onClose");
      onClose();
    } else {
      console.log("onClose is not defined!");
    }
  }, [onClose]);

  const handleBackdropClick = useCallback(() => {
    console.log("Backdrop clicked");
    if (onClose) {
      console.log("Calling onClose from backdrop");
      onClose();
    }
  }, [onClose]);

  const handleLinkClick = useCallback(() => {
    if (window.innerWidth <= 768 && onClose) {
      console.log("Link clicked on mobile, closing sidebar");
      onClose();
    }
  }, [onClose]);

  const handleLogoutClick = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setLoggingOut(true);
    // onLogout is defined in DashboardLayout as a call to AuthContext.logout()
    onLogout?.()
      .catch((error) => {
        console.error("Logout error:", error);
      })
      .finally(() => {
        setLoggingOut(false);
        setShowLogoutModal(false);
        navigate("/login", { replace: true });
      });
  }, [onLogout, navigate]);

  const superAdminLinks = [
    { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
    { to: "/organizations", icon: Building2, label: "Organizations" },
    { to: "/requests", icon: FileText, label: "Requests" },
    { to: "/payments", icon: CreditCard, label: "Payments" },
    { to: "/logs", icon: ShieldAlert, label: "System Logs" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const getLinksForRole = () => {
    return superAdminLinks;
  };

  const links = getLinksForRole();
  const roleLabel = ROLE_LABELS[role] || "User";

  const userDisplayName = user?.full_name || user?.name || user?.email?.split('@')[0] || "User";
  const userInitials = userDisplayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div
        className={cn("ds-sidebar-backdrop", isOpen && "show")}
        onClick={handleBackdropClick}
      />

      <aside
        className={cn(
          "ds-sidebar",
          isCollapsed && "ds-sidebar--collapsed",
          isOpen && "ds-sidebar--open"
        )}
      >
        <div className="ds-sidebar__header">
          <div className="ds-sidebar__logo">
            <AnimatePresence mode="wait">
              {isCollapsed ? (
                <motion.img
                  key="compact"
                  src={nexo}
                  alt="Nexo"
                  className="ds-sidebar__logo-compact"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                />
              ) : (
                <motion.img
                  key="full"
                  src={nexoFull}
                  alt="Nexo"
                  className="ds-sidebar__logo-full"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                />
              )}
            </AnimatePresence>
          </div>

          <button
            className="ds-sidebar__close"
            onClick={handleClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          <button
            className="ds-sidebar__toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={16} transition={{ duration: 0.3 }} style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>

        <nav className="ds-sidebar__nav">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              badge={link.badge}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          ))}
        </nav>

        <div className="ds-sidebar__footer">
          <div className={cn("ds-sidebar__user-card", isCollapsed && "ds-sidebar__user-card--collapsed")}>
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
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out"
        description="Are you sure you want to sign out? You'll need to sign in again to access your account."
        variant="logout"
        confirmText="Sign Out"
        cancelText="Cancel"
        loading={loggingOut}
      />
    </>
  );
}

export default Sidebar;
export { Sidebar, SidebarLink, SidebarGroup };
