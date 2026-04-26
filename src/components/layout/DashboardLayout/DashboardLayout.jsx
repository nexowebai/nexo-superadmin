import { useState, useCallback, useEffect, Suspense } from "react"; // Touched for HMR
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@lib/cn";
import { useAuth } from "@context/AuthContext";
import Sidebar from "../Sidebar";
import Header from "../Header";
import "./DashboardLayout.css";
import { NotificationDrawer } from "@components/common";
import { PageLoader } from "@components/ui";

function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = useCallback(() => {
    return logout();
  }, [logout]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationOpen(false);
  }, []);

  useEffect(() => {
    closeSidebar();
    closeNotification();
  }, [location.pathname, closeSidebar, closeNotification]);

  const displayUser = user || {
    name: "User",
    email: "user@example.com",
  };

  return (
    <div className="ds-dashboard">
      <Sidebar
        role={role || "super-admin"}
        user={displayUser}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="ds-dashboard__main">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setNotificationOpen(true)}
        />

        <main className="ds-dashboard__content">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={closeNotification}
      />
    </div>
  );
}

function PageContainer({ children, className }) {
  return <div className={cn("ds-page-container", className)}>{children}</div>;
}

function PageHeader({
  title,
  description,
  children,
  backPath,
  backLabel = "Back",
}) {
  const navigate = useNavigate();

  return (
    <div className="ds-page-header">
      <div className="ds-page-header__content">
        <h1 className="ds-page-header__title">{title}</h1>
        {description && (
          <p className="ds-page-header__description">{description}</p>
        )}
      </div>
      <div className="ds-page-header__actions">
        {children}
        {backPath && (
          <button
            className="ds-page-header__back"
            onClick={() => navigate(backPath)}
          >
            {backLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export { DashboardLayout, PageContainer, PageHeader };
export default DashboardLayout;
