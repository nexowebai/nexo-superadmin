import { Toaster } from "sonner";
import { useTheme } from "@context";

const InfoCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16V12M12 8H12.01"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export function AppToaster() {
  const { mode } = useTheme();

  return (
    <Toaster
      theme={mode}
      position="top-right"
      expand={true}
      richColors={false}
      closeButton={true}
      duration={5000}
      icons={{
        success: <InfoCircleIcon />,
        error: <InfoCircleIcon />,
        info: <InfoCircleIcon />,
      }}
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
