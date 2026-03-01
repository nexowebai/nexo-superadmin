import { forwardRef, useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@lib/cn";
import "./Checkbox.css";

const Checkbox = forwardRef(
  (
    {
      onChange,
      disabled = false,
      label,
      id: propId,
      className,
      error,
      name,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = propId || generatedId;

    const handleChange = (e) => {
      console.log("checkbox clicked", e.target.checked);
      if (onChange) onChange(e);
    };

    return (
      <label
        htmlFor={id}
        className={cn(
          "ds-checkbox-container",
          disabled && "ds-checkbox--disabled",
          className,
        )}
      >
        <span className="ds-checkbox-wrapper">
          <input
            ref={ref}
            id={id}
            name={name}
            type="checkbox"
            onChange={handleChange}
            disabled={disabled}
            className="ds-checkbox-input"
            {...props}
          />
          <span
            className={cn("ds-checkbox-box", error && "ds-checkbox-box--error")}
          >
            <Check className="ds-checkbox-icon" size={14} strokeWidth={3} />
          </span>
        </span>

        {label && <span className="ds-checkbox-label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
