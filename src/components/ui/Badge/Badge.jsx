import { cn } from "@lib/cn";
import "./Badge.css";

function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "ds-badge",
        `ds-badge--${variant}`,
        `ds-badge--${size}`,
        dot && "ds-badge--dot",
        className,
      )}
      {...props}
    >
      {dot && <span className="ds-badge__dot" />}
      {children}
    </span>
  );
}

export default Badge;
