import { useEffect } from "react";
import { useAuth } from "@context";

export function SessionListener() {
  const { logout } = useAuth();

  useEffect(() => {
    const handleSessionExpired = (event) => {
      console.warn("Session expired:", event.detail?.message);
      logout();
      window.location.href = "/login?session=expired";
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, [logout]);

  return null;
}
