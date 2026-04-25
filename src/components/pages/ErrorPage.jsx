import { useRouteError } from "react-router-dom";
import { ErrorFallback } from "@components/common/ErrorBoundary/ErrorBoundary";

/**
 * Standard Error Page component that reuses the premium ErrorFallback UI.
 * This component is used by react-router-dom as the errorElement.
 */
export default function ErrorPage() {
  const error = useRouteError();
  
  // Handle reset for router errors
  const handleReset = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc]">
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={handleReset} 
      />
    </div>
  );
}
