import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, LayoutGrid, Building2, Bell, Settings, CreditCard, FileText, Briefcase, ShieldAlert, ShieldCheck } from "lucide-react";
import { ConfirmModal } from "@components/ui/Modal";
import { cn } from "@lib/cn";
import { rotate } from "@lib/motion";
import nexoFull from "@assets/logo/nexo-full.png";
import nexo from "@assets/logo/nexo.png";
import { ROLE_LABELS } from "@constants/roles";
import { SidebarLink } from "./components/SidebarLink";
import { SidebarFooter } from "./components/SidebarFooter";
import "./Sidebar.css";

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
    // Audit log for state transitions in production
    console.debug(`[Sidebar] State change | isOpen: ${isOpen} | onClose: ${!!onClose}`);
  }, [isOpen, onClose]);

  const toggleSidebar = useCallback(() => setIsCollapsed(prev => !prev), []);
  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const handleLinkClick = useCallback(() => {
    if (window.innerWidth <= 768) onClose?.();
  }, [onClose]);

  const handleLogoutConfirm = useCallback(() => {
    setLoggingOut(true);
    onLogout?.()
      .catch(error => console.error("Logout failure:", error))
      .finally(() => {
        setLoggingOut(false);
        setShowLogoutModal(false);
        navigate("/login", { replace: true });
      });
  }, [onLogout, navigate]);

  const links = [
    { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
    { to: "/organizations", icon: Building2, label: "Organizations" },
    { to: "/requests", icon: FileText, label: "Requests" },
    { to: "/payments", icon: CreditCard, label: "Payments" },
    { to: "/billing", icon: Briefcase, label: "Plans & Coupons" },
    { to: "/logs", icon: ShieldAlert, label: "Logs" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/policy", icon: ShieldCheck, label: "Privacy" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const userDisplayName = user?.full_name || user?.name || user?.email?.split("@")[0] || "User";
  const userInitials = userDisplayName.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className={cn("ds-sidebar-backdrop", isOpen && "show")} onClick={() => onClose?.()} />
      <aside className={cn("ds-sidebar", isCollapsed && "ds-sidebar--collapsed", isOpen && "ds-sidebar--open")}>
        <div className="ds-sidebar__header">
          <div className="ds-sidebar__logo">
            <AnimatePresence mode="wait">
              <motion.img
                key={isCollapsed ? "compact" : "full"}
                src={isCollapsed ? nexo : nexoFull}
                alt="Nexo"
                className={isCollapsed ? "ds-sidebar__logo-compact" : "ds-sidebar__logo-full"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              />
            </AnimatePresence>
          </div>
          <button className="ds-sidebar__close" onClick={handleClose}><X size={20} /></button>
          <button className="ds-sidebar__toggle" onClick={toggleSidebar}>
            <motion.div animate={isCollapsed ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft size={16} />
            </motion.div>
          </button>
        </div>

        <nav className="ds-sidebar__nav">
          {links.map(link => (
            <SidebarLink key={link.to} {...link} isCollapsed={isCollapsed} onClick={handleLinkClick} />
          ))}
        </nav>

        <SidebarFooter
          user={user}
          userDisplayName={userDisplayName}
          userInitials={userInitials}
          roleLabel={ROLE_LABELS[role] || "User"}
          isCollapsed={isCollapsed}
          handleLogoutClick={() => setShowLogoutModal(true)}
        />
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Account Logout"
        description="Are you sure you want to end your Super Admin session? You'll need to re-authenticate to regain terminal access."
        confirmText="Logout Now"
        variant="logout"
        loading={loggingOut}
      />
    </>
  );
}

export { SidebarLink } from "./components/SidebarLink";
export { SidebarGroup } from "./components/SidebarGroup";
export { Sidebar };
export default Sidebar;
