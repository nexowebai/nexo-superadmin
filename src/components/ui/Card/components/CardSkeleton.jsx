import { cn } from "@lib/cn";
import { Skeleton } from "../../Skeleton";

export function CardSkeleton({
  lines = 3,
  showHeader = true,
  variant = "text",
  padding = "md",
  height = 200,
  className,
}) {
  return (
    <div className={cn("ds-card", `ds-card--padding-${padding}`, className)}>
      {showHeader && (
        <div
          className="ds-card__header"
          style={{ marginBottom: "var(--space-4)" }}
        >
          <Skeleton variant="title" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      )}
      <div className="ds-card__content">
        {variant === "chart" ? (
          <Skeleton variant="rect" width="100%" height={`${height}px`} />
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                width={i === lines - 1 ? "75%" : "100%"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardSkeleton;
