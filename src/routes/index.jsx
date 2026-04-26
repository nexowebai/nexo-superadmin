import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { DashboardLayout } from "@components/layout/DashboardLayout";
import AuthLayout from "@components/layout/AuthLayout";
import { PageLoader } from "@components/ui";

// Core Pages
import LoginPage from "@features/auth/pages/LoginPage";
import ForgotPasswordPage from "@features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@features/auth/pages/ResetPasswordPage";
import SetPasswordPage from "@features/auth/pages/SetPasswordPage";
import ErrorPage from "@components/pages/ErrorPage";

// Lazy Loaded Features
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage.jsx"));
const OrganizationsPage = lazy(() => import("../features/organizations/pages/OrganizationsPage.jsx"));
const OrganizationDetailPage = lazy(() => import("@features/organizations/pages/OrganizationDetailPage"));
const CreateOrganizationPage = lazy(() => import("@features/organizations/pages/CreateOrganizationPage"));
const AdminsPage = lazy(() => import("@features/admins/pages/AdminsPage"));
const CreateAdminPage = lazy(() => import("@features/admins/pages/CreateAdminPage"));
const RequestsPage = lazy(() => import("@features/requests/pages/RequestsPage"));
const LogsPage = lazy(() => import("@features/logs/pages/LogsPage"));
const SettingsPage = lazy(() => import("@features/settings/pages/SettingsPage"));
const NotificationsPage = lazy(() => import("@features/notifications/pages/NotificationsPage"));
const ProfilePage = lazy(() => import("@features/settings/pages/ProfilePage"));
const PaymentsPage = lazy(() => import("@features/payments/pages/PaymentsPage"));
const BillingSystemPage = lazy(() => import("@features/billing/pages/BillingSystemPage"));
const PrivacyPolicyPage = lazy(() => import("@features/content/pages/PrivacyPolicyPage"));

/**
 * Institutional Route Guard System
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        
        // Public Auth Routes
        {
          element: <PublicRoute><AuthLayout /></PublicRoute>,
          children: [
            { path: "login", element: <LoginPage /> },
            { path: "forgot-password", element: <ForgotPasswordPage /> },
            { path: "reset-password", element: <ResetPasswordPage /> },
            { path: "set-password", element: <SetPasswordPage /> },
          ],
        },

        // Protected Dashboard Routes
        {
          element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
          children: [
            { path: "dashboard", element: withSuspense(DashboardPage) },
            { path: "notifications", element: withSuspense(NotificationsPage) },
            
            // Organization Management
            { path: "organizations", element: withSuspense(OrganizationsPage) },
            { path: "organizations/create", element: withSuspense(CreateOrganizationPage) },
            { path: "organizations/:id", element: withSuspense(OrganizationDetailPage) },
            { path: "organizations/:id/edit", element: withSuspense(CreateOrganizationPage) },
            
            // System Administration
            { path: "admins", element: withSuspense(AdminsPage) },
            { path: "admins/create", element: withSuspense(CreateAdminPage) },
            { path: "requests", element: withSuspense(RequestsPage) },
            { path: "payments", element: withSuspense(PaymentsPage) },
            { path: "logs", element: withSuspense(LogsPage) },
            { path: "billing", element: withSuspense(BillingSystemPage) },
            { path: "policy", element: withSuspense(PrivacyPolicyPage) },
            
            // User Settings
            { path: "profile", element: withSuspense(ProfilePage) },
            { path: "settings", element: withSuspense(SettingsPage) },
            { path: "user-settings", element: withSuspense(ProfilePage) },
          ],
        },
        
        { path: "*", element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default function AppRoutes() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
