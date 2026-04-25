import React from "react";
import { cn } from "@lib/cn";

// Custom Modern SVG Icons to match the "lean modern" request
const SuccessIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 12L10.5 15L16.5 9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 9L9 15M9 9L15 15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AuthAlert = ({
  type = "error",
  message,
  onDismiss,
  className,
}) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 p-5 border rounded-2xl animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500",
        isError
          ? "bg-[#FEF2F2] border-[#FEE2E2] text-[#991B1B]"
          : "bg-[#F0FDF4] border-[#DCFCE7] text-[#166534]",
        "shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-105 duration-300",
          isError ? "bg-[#FEE2E2]" : "bg-[#DCFCE7]",
        )}
      >
        {isError ? <ErrorIcon /> : <SuccessIcon />}
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold tracking-tight uppercase opacity-60">
          {isError ? "Alert" : "Verified"}
        </p>
        <p className="text-sm font-medium leading-relaxed mt-0.5">{message}</p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-90 transition-all duration-200"
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
