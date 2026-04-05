import { cn } from "@lib/cn";

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("ds-card__description", className)} {...props}>
      {children}
    </p>
  );
}

export default CardDescription;
