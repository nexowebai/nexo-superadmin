import { cn } from "@lib/cn";
import "./Toggle.css";

function Toggle({
  checked,
  onChange,
  size = "md",
  disabled = false,
  className,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "ds-toggle",
        `ds-toggle--${size}`,
        checked && "ds-toggle--checked",
        disabled && "ds-toggle--disabled",
        className,
      )}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      <span className="ds-toggle__track">
        <span className="ds-toggle__thumb" />
      </span>
    </button>
  );
}

export default Toggle;
