import { lazy } from "react";

const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@features/auth/pages/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@features/auth/pages/ResetPasswordPage"),
);
const SetPasswordPage = lazy(
  () => import("@features/auth/pages/SetPasswordPage"),
);

export const authRoutes = [
  { path: "login", element: LoginPage },
  { path: "forgot-password", element: ForgotPasswordPage },
  { path: "reset-password", element: ResetPasswordPage },
  { path: "set-password", element: SetPasswordPage },
];

export { LoginPage, ForgotPasswordPage, ResetPasswordPage, SetPasswordPage };
