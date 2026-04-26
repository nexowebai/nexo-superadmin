import React from "react";
import { cn } from "@lib/cn";

export function FormField({ label, icon: Icon, error, ...props }) {
  return (
    <div className="form-field">
      <label className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon size={14} className="text-muted" />}
        {label}
      </label>
      <div className="relative">
        <input
          className={cn(
            "w-full transition-all",
            error && "border-error focus:ring-error-soft"
          )}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-bold text-error mt-1 uppercase tracking-wider block">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
