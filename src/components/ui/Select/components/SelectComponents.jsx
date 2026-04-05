import { motion } from "framer-motion";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@lib/cn";

export const SelectTrigger = ({ isOpen, error, disabled, multiple, Icon, value, renderTrigger, renderValue, placeholder, clearable, onClear, onClick, size, className }) => (
  <button
    type="button"
    className={cn("ds-select__trigger", isOpen && "ds-select__trigger--open", error && "ds-select__trigger--error", disabled && "ds-select__trigger--disabled", multiple && "ds-select__trigger--multiple", className)}
    onClick={onClick}
    disabled={disabled}
  >
    {Icon && <Icon size={18} className="ds-select__trigger-icon" />}
    <div className="ds-select__content">{renderValue()}</div>
    <div className="ds-select__icons">
      {clearable && ((multiple && value?.length > 0) || (!multiple && value)) && (
        <span className="ds-select__clear" onClick={onClear}><X size={14} /></span>
      )}
      <ChevronDown size={16} className={cn("ds-select__chevron", isOpen && "ds-select__chevron--open")} />
    </div>
  </button>
);

export const SelectOption = ({ option, isSelected, multiple, renderOption, onClick }) => (
  <button
    type="button"
    className={cn("ds-select__option", isSelected && "ds-select__option--selected")}
    onClick={() => onClick(option)}
  >
    {renderOption ? (
      renderOption(option, isSelected)
    ) : (
      <>
        {multiple && (
          <div className={cn("ds-select__checkbox", isSelected && "ds-select__checkbox--checked")}>
            {isSelected && <Check size={12} />}
          </div>
        )}
        <span className="ds-select__option-label">{option.label}</span>
        {!multiple && isSelected && <Check size={16} className="ds-select__check" />}
      </>
    )}
  </button>
);

export const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.3, bounce: 0.2 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};
