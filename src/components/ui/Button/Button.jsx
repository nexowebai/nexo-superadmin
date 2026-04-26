import { forwardRef } from "react";
import { cn } from "@lib/cn";
import "./styles/Button.css";

const ButtonLoader = () => (
  <div className="ds-button__dots">
    <span className="ds-button__dot" />
    <span className="ds-button__dot" />
    <span className="ds-button__dot" />
  </div>
);

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon: Icon,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconPosition = "left",
      fullWidth = false,
      type = "button",
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    let LIcon = null;
    let RIcon = null;

    if (LeftIcon) {
      LIcon = LeftIcon;
    } else if (RightIcon) {
      if (
        typeof RightIcon === "function" ||
        (typeof RightIcon === "object" && RightIcon !== null)
      ) {
        RIcon = RightIcon;
      } else if (RightIcon === true && Icon) {
        RIcon = Icon;
      }
    } else if (Icon) {
      if (iconPosition === "left") LIcon = Icon;
      else RIcon = Icon;
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "ds-button",
          `ds-button--${variant}`,
          `ds-button--${size}`,
          fullWidth && "ds-button--full",
          isDisabled && "ds-button--disabled",
          loading && "ds-button--loading",
          className,
        )}
        {...props}
      >
        {loading ? (
          <ButtonLoader />
        ) : (
          <>
            {LIcon && (
              <LIcon className="ds-button__icon ds-button__icon--left" />
            )}

            <span className="ds-button__label">{children}</span>

            {RIcon && (
              <RIcon className="ds-button__icon ds-button__icon--right" />
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
