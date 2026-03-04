import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Receipt, RefreshCw, Zap } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { DashboardLayout, PageContainer } from "@components/layout/DashboardLayout";
import AuthLayout from "@components/layout/AuthLayout";
import { Skeleton } from "@components/ui/Skeleton";
import { Alert } from "@components/ui/Alert";
import ComingSoonPage from "@components/pages/ComingSoonPage";

import LoginPage from "@features/auth/pages/LoginPage";
import ForgotPasswordPage from "@features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@features/auth/pages/ResetPasswordPage";
import SetPasswordPage from "@features/auth/pages/SetPasswordPage";

const SuperAdminDashboardPage = lazy(() =>
  import("@features/dashboard/pages/DashboardPage")
);
const OrganizationsPage = lazy(() =>
  import("@features/organizations/pages/OrganizationsPage")
);
const OrganizationDetailPage = lazy(() =>
  import("@features/organizations/pages/OrganizationDetailPage")
);
const CreateOrganizationPage = lazy(() =>
  import("@features/organizations/pages/CreateOrganizationPage")
);
const AdminsPage = lazy(() =>
  import("@features/admins/pages/AdminsPage")
);
const CreateAdminPage = lazy(() =>
  import("@features/admins/pages/CreateAdminPage")
);
const RequestsPage = lazy(() =>
  import("@features/requests/pages/RequestsPage")
);
const LogsPage = lazy(() =>
  import("@features/logs/pages/LogsPage")
);
const SettingsPage = lazy(() =>
  import("@features/settings/pages/SettingsPage")
);
const NotificationsPage = lazy(() =>
  import("@features/notifications/pages/NotificationsPage")
);
const ProfilePage = lazy(() =>
  import("@features/settings/pages/ProfilePage")
);
const PaymentsPage = lazy(() =>
  import("@features/payments/pages/PaymentsPage")
);
const BillingSystemPage = lazy(() =>
  import("@features/billing/pages/BillingSystemPage")
);
const PrivacyPolicyPage = lazy(() =>
  import("@features/content/pages/PrivacyPolicyPage")
);

function PaymentsComingSoon() {
  return (
    <ComingSoonPage
      title="Payments"
      subtitle="Our comprehensive payment management system is almost ready."
      icon={CreditCard}
      features={[
        {
          icon: DollarSign,
          title: "Revenue Tracking",
          description: "Monitor all payment transactions",
        },
        {
          icon: Receipt,
          title: "Invoice Management",
          description: "Generate and track invoices",
        },
        {
          icon: RefreshCw,
          title: "Refund Processing",
          description: "Handle refunds with ease",
        },
        {
          icon: Zap,
          title: "Instant Payouts",
          description: "Fast and secure payments",
        },
      ]}
    />
  );
}

function PageLoader() {
  return (
    <div className="ds-page-loader">
      <div className="ds-page-loader__content">
        <Skeleton variant="rect" width="100%" height={200} />
        <div style={{ marginTop: 24 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const userRole = user?.role;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
}

function SessionExpiredAlert() {
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("session") === "expired";

  if (!sessionExpired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 24 }}
    >
      <Alert variant="warning" title="Session Expired">
        Your session has expired. Please sign in again to continue.
      </Alert>
    </motion.div>
  );
}


function DashboardDispatcher() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "super-admin") {
    return (
      <Suspense fallback={<PageLoader />}>
        <SuperAdminDashboardPage />
      </Suspense>
    );
  }

  return <Navigate to="/login" replace />;
}

function SettingsDispatcher() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SettingsPage />
    </Suspense>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "set-password",
        element: <SetPasswordPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <DashboardDispatcher />,
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotificationsPage />
          </Suspense>
        ),
      },
      {
        path: "organizations",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <OrganizationsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "organizations/create",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <CreateOrganizationPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "organizations/:id",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <OrganizationDetailPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "organizations/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <CreateOrganizationPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "admins",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <AdminsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "admins/create",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <CreateAdminPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "requests",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <RequestsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <PaymentsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "logs",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <LogsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "billing",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <BillingSystemPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "policy",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicyPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "user-settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: <SettingsDispatcher />,
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
