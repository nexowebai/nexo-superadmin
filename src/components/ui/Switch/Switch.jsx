import { cn } from "@lib/cn";
import "./Switch.css";

export default function Switch({ checked, onChange, disabled, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "ds-switch",
        checked && "ds-switch--checked",
        disabled && "ds-switch--disabled",
        className,
      )}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className="ds-switch__thumb" />
    </button>
  );
}
