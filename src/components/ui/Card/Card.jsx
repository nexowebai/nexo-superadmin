import { forwardRef } from "react";
import { cn } from "@lib/cn";
import "./styles/Card.css";

const Card = forwardRef(
  (
    {
      children,
      variant: variantProp = "default",
      padding = "md",
      hover: hoverable = false,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const validVariants = [
      "default",
      "flat",
      "outline",
      "glass",
      "elevated",
      "pro",
      "nx",
    ];
    const variant = validVariants.includes(variantProp)
      ? variantProp
      : "default";

    return (
      <div
        ref={ref}
        className={cn(
          "ds-card",
          `ds-card--${variant}`,
          `ds-card--padding-${padding}`,
          hoverable && "ds-card--hoverable",
          onClick && "ds-card--clickable",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
export { Card };
export { CardHeader } from "./components/CardHeader";
export { CardTitle } from "./components/CardTitle";
export { CardDescription } from "./components/CardDescription";
export { CardContent } from "./components/CardContent";
export { CardFooter } from "./components/CardFooter";
export { CardSkeleton } from "./components/CardSkeleton";
