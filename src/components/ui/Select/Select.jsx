import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@lib/cn";
import "./Select.css";

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  disabled = false,
  clearable = false,
  searchable = false,
  multiple = false,
  fullWidth = true,
  icon: Icon,
  className,
  size = "md",
  renderOption,
  renderTrigger,
  renderValue: externalRenderValue,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const isSelected = (val) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const selectedOptions = multiple
    ? options.filter((opt) => Array.isArray(value) && value.includes(opt.value))
    : options.find((opt) => opt.value === value);

  const filteredOptions =
    searchable && search
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
      setSearch("");
    }
  }, []);

  const handleScroll = useCallback(
    (e) => {
      if (isOpen) {
        const isInternalScroll = e.target.closest(".ds-select__options");
        if (isInternalScroll) return;

        setIsOpen(false);
        setSearch("");
      }
    },
    [isOpen],
  );

  const updatePosition = useCallback(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 240; // Max height from CSS or estimated
      const shouldOpenUp =
        spaceBelow < dropdownHeight && rect.top > dropdownHeight;

      setCoords({
        top: shouldOpenUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        isUp: shouldOpenUp,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      document.addEventListener("mousedown", handleClickOutside);
      if (searchable && inputRef.current) inputRef.current.focus();
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, updatePosition, handleClickOutside, searchable]);

  // Handle initial focus when portal opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      // Small timeout to allow portal to render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  const handleSelect = (option) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.value)
        ? currentValue.filter((v) => v !== option.value)
        : [...currentValue, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : null);
  };

  const renderValue = () => {
    if (externalRenderValue) return externalRenderValue();

    if (multiple) {
      const sels = selectedOptions || [];
      if (sels.length === 0)
        return (
          <span className="ds-select__value--placeholder">{placeholder}</span>
        );
      return (
        <div className="ds-select__chips">
          {sels.slice(0, 4).map((opt) => (
            <span key={opt.value} className="ds-select__chip">
              {opt.label}
            </span>
          ))}
          {sels.length > 4 && (
            <span className="ds-select__more">+{sels.length - 4} more</span>
          )}
        </div>
      );
    }
    return (
      <span
        className={cn(
          "ds-select__value",
          !selectedOptions && "ds-select__value--placeholder",
        )}
      >
        {selectedOptions ? selectedOptions.label : placeholder}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "ds-select",
        `ds-select--${size}`,
        fullWidth && "ds-select--full",
        className,
      )}
      ref={containerRef}
    >
      {label && <label className="ds-select__label">{label}</label>}
      <button
        type="button"
        className={cn(
          "ds-select__trigger",
          isOpen && "ds-select__trigger--open",
          error && "ds-select__trigger--error",
          disabled && "ds-select__trigger--disabled",
          multiple && "ds-select__trigger--multiple",
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {Icon && <Icon size={18} className="ds-select__trigger-icon" />}
        <div className="ds-select__content">{renderValue()}</div>
        <div className="ds-select__icons">
          {clearable &&
            ((multiple && value?.length > 0) || (!multiple && value)) && (
              <span className="ds-select__clear" onClick={handleClear}>
                <X size={14} />
              </span>
            )}
          <ChevronDown
            size={16}
            className={cn(
              "ds-select__chevron",
              isOpen && "ds-select__chevron--open",
            )}
          />
        </div>
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              className="ds-select__dropdown ds-select-portal"
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 30000,
                transform: coords.isUp ? "translateY(-100%)" : "none",
                transformOrigin: coords.isUp ? "bottom" : "top",
              }}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {searchable && (
                <div className="ds-select__search">
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="ds-select__search-input"
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="ds-select__options" ref={listRef}>
                {filteredOptions.length === 0 ? (
                  <div className="ds-select__empty">No options found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        "ds-select__option",
                        isSelected(option.value) &&
                          "ds-select__option--selected",
                      )}
                      onClick={() => handleSelect(option)}
                    >
                      {renderOption ? (
                        renderOption(option, isSelected(option.value))
                      ) : (
                        <>
                          {multiple && (
                            <div
                              className={cn(
                                "ds-select__checkbox",
                                isSelected(option.value) &&
                                  "ds-select__checkbox--checked",
                              )}
                            >
                              {isSelected(option.value) && <Check size={12} />}
                            </div>
                          )}
                          <span className="ds-select__option-label">
                            {option.label}
                          </span>
                          {!multiple && isSelected(option.value) && (
                            <Check size={16} className="ds-select__check" />
                          )}
                        </>
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
      {error && <span className="ds-select__error">{error}</span>}
    </div>
  );
}

export default Select;
