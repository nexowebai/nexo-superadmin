import { cn } from "@lib/cn";

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("ds-card__content", className)} {...props}>
      {children}
    </div>
  );
}

export default CardContent;
