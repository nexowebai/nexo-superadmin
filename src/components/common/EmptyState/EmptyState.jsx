import { cn } from "@lib/cn";
import "./EmptyState.css";

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}) {
  return (
    <div className={cn("ds-empty-state", `ds-empty-state--${size}`, className)}>
      {Icon && (
        <div className="ds-empty-state__icon">
          <Icon />
        </div>
      )}
      {title && <h3 className="ds-empty-state__title">{title}</h3>}
      {description && (
        <p className="ds-empty-state__description">{description}</p>
      )}
      {action && <div className="ds-empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
