import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@lib/queryClient";
import {
  ThemeProvider,
  LayoutProvider,
  AuthProvider,
  NotificationProvider,
} from "@context";
import AppRoutes from "@/routes";
import { AppToaster } from "@core/components/AppToaster";
import { SessionListener } from "@core/components/SessionListener";
import { GlobalLoader } from "@core/components/GlobalLoader";
import "@styles/index.css";

/**
 * Main Application Orchestrator
 * Keeps a clean structure by delegating global features to core components.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <LayoutProvider>
              {/* Global Listeners & Utilities */}
              <SessionListener />
              <GlobalLoader />
              <AppToaster />
              
              {/* Application Routing */}
              <AppRoutes />
            </LayoutProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
