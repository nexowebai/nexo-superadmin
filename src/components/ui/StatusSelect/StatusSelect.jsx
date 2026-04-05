import React, { useMemo } from "react";
import { Select } from "@components/ui";

export function StatusSelect({
  value,
  onChange,
  disabled,
  options,
  size = "sm",
  className,
  fullWidth = false,
}) {
  const current = useMemo(
    () => options.find((o) => o.value === value) || options[0],
    [options, value],
  );

  return (
    <div className="status-select-wrapper" onClick={(e) => e.stopPropagation()}>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`status-select status-select--${current?.variant || "default"} ${className || ""}`}
        size={size}
        fullWidth={fullWidth}
        renderOption={(option) => (
          <div
            className={`status-option status-option--${option.variant || "default"}`}
          >
            <span className="status-option__dot" />
            <span>{option.label}</span>
          </div>
        )}
        renderValue={() => (
          <div
            className={`status-trigger status-trigger--${current?.variant || "default"}`}
          >
            <span className="status-trigger__dot" />
            <span>{current?.label}</span>
          </div>
        )}
      />
    </div>
  );
}
