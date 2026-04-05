import { forwardRef } from "react";
import { X } from "lucide-react";
import "./Chip.css";

export const Chip = forwardRef(function Chip(
  {
    children,
    onRemove,
    variant = "default",
    size = "md",
    removable = false,
    icon: Icon,
    className = "",
    ...props
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={`ds-chip ds-chip--${variant} ds-chip--${size} ${className}`}
      {...props}
    >
      {Icon && <Icon className="ds-chip__icon" />}
      <span className="ds-chip__text">{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          className="ds-chip__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
});

export function ChipInput({
  label,
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  maxChips,
  className = "",
  error,
  helperText,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
        e.preventDefault();
        const newValue = inputValue.trim();
        if (
          !value.includes(newValue) &&
          (!maxChips || value.length < maxChips)
        ) {
          onChange([...value, newValue]);
          setInputValue("");
        }
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    [inputValue, value, onChange, maxChips],
  );

  const handleRemove = useCallback(
    (chipToRemove) => {
      onChange(value.filter((v) => v !== chipToRemove));
    },
    [value, onChange],
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",").filter((p) => p.trim());
      const newChips = parts.filter(
        (p) => !value.includes(p.trim()) && p.trim(),
      );
      if (newChips.length > 0) {
        onChange([...value, ...newChips.map((p) => p.trim())]);
      }
      setInputValue("");
    } else {
      setInputValue(val);
    }
  };

  return (
    <div
      className={`ds-chip-input ${className} ${error ? "ds-chip-input--error" : ""}`}
    >
      {label && <label className="ds-chip-input__label">{label}</label>}
      <div
        className={`ds-chip-input__container ${isFocused ? "ds-chip-input__container--focused" : ""}`}
      >
        <div className="ds-chip-input__chips">
          <AnimatePresence mode="popLayout">
            {value.map((chip) => (
              <Chip
                key={chip}
                removable
                onRemove={() => handleRemove(chip)}
                size="sm"
                variant="secondary"
              >
                {chip}
              </Chip>
            ))}
          </AnimatePresence>
          <input
            type="text"
            className="ds-chip-input__input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={maxChips && value.length >= maxChips}
          />
        </div>
        {inputValue && (
          <button
            type="button"
            className="ds-chip-input__add"
            onClick={() => {
              if (inputValue.trim() && !value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
                setInputValue("");
              }
            }}
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      {helperText && (
        <span className="ds-chip-input__helper">{helperText}</span>
      )}
      {error && <span className="ds-chip-input__error">{error}</span>}
    </div>
  );
}

export default Chip;
