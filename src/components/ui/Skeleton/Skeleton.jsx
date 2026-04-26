import { cn } from "@lib/cn";
import "./Skeleton.css";

function Skeleton({
  variant = "text",
  width,
  height,
  className,
  count = 1,
  circle = false,
  borderRadius,
  ...props
}) {
  const style = {
    ...(width && { width }),
    ...(height && { height }),
    ...(borderRadius && { borderRadius }),
  };

  if (count > 1) {
    return (
      <div className="ds-skeleton-group">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "ds-skeleton",
              `ds-skeleton--${variant}`,
              circle && "ds-skeleton--circle",
              className,
            )}
            style={style} /* allowed-inline */
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "ds-skeleton",
        `ds-skeleton--${variant}`,
        circle && "ds-skeleton--circle",
        className,
      )}
      style={style} /* allowed-inline */
      {...props}
    />
  );
}

function SkeletonText({ lines = 3, lastLineWidth = "75%" }) {
  return (
    <div className="ds-skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ showAvatar = false, showFooter = false }) {
  return (
    <div className="ds-skeleton-card">
      <div className="ds-skeleton-card__header">
        {showAvatar && <Skeleton variant="avatar" />}
        <div className="ds-skeleton-card__header-text">
          <Skeleton variant="title" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="ds-skeleton-card__body">
        <SkeletonText lines={3} />
      </div>
      {showFooter && (
        <div className="ds-skeleton-card__footer">
          <Skeleton variant="button" width="80px" />
          <Skeleton variant="button" width="80px" />
        </div>
      )}
    </div>
  );
}

function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="ds-skeleton-table">
      <div className="ds-skeleton-table__header">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height="14px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="ds-skeleton-table__row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              height="14px"
              width={colIndex === 0 ? "80%" : "60%"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonChart({ type = "bar" }) {
  if (type === "bar") {
    return (
      <div className="ds-skeleton-chart ds-skeleton-chart--bar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="ds-skeleton ds-skeleton-chart__bar"
            style={{ height: `${30 + Math.random() * 50}%` }} /* allowed-inline */
          />
        ))}
      </div>
    );
  }

  return (
    <div className="ds-skeleton-chart ds-skeleton-chart--area">
      <Skeleton variant="rect" width="100%" height="200px" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonChart };
export default Skeleton;
