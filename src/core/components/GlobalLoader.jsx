import { useAuth } from "@context";

export function GlobalLoader() {
  const { loading } = useAuth();
  const isAuthPage = window.location.pathname.match(
    /^\/(login|forgot-password|reset-password|set-password|login)/,
  );

  if (!loading || isAuthPage) return null;

  return (
    <div className="app-loader">
      <div className="app-loader__spinner"></div>
    </div>
  );
}
