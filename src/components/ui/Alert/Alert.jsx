import React, { forwardRef } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import "./Alert.css";

const ICON_MAP = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

export const AlertContainer = ({ children, className = "" }) => {
  return (
    <div
      className={["ds-alert-container", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};

const Alert = forwardRef((props, ref) => {
  const {
    title,
    children,
    variant = "info",
    onDismiss,
    className = "",
    ...rest
  } = props;

  const Icon = ICON_MAP[variant] || Info;

  const componentClasses = ["ds-alert", `ds-alert--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} role="alert" className={componentClasses} {...rest}>
      <div className="ds-alert__icon">
        <Icon size={20} strokeWidth={2.5} />
      </div>

      <div className="ds-alert__body">
        {title && <strong className="ds-alert__title">{title}</strong>}
        <div className="ds-alert__description">{children}</div>
      </div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Close"
          className="ds-alert__close-btn"
          onClick={onDismiss}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
});

Alert.displayName = "Alert";

export default Alert;
