import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/cn";
import {
  SelectTrigger,
  SelectOption,
  dropdownVariants,
} from "./components/SelectComponents";
import "./Select.css";

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
  renderValue: externalRenderValue,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize value for comparison
  const normalizedValue = value ?? (multiple ? [] : "");

  const isSelected = (val) =>
    multiple 
      ? Array.isArray(normalizedValue) && normalizedValue.includes(val) 
      : normalizedValue === val;

  const selectedOptions = multiple
    ? options.filter((opt) => Array.isArray(normalizedValue) && normalizedValue.includes(opt.value))
    : options.find((opt) => opt.value === normalizedValue);

  const filteredOptions =
    searchable && search
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const updatePosition = useCallback(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const shouldOpenUp =
        window.innerHeight - rect.bottom < 240 && rect.top > 240;
      setCoords({
        top: shouldOpenUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        isUp: shouldOpenUp,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      document.addEventListener("mousedown", handleClick);
      if (searchable) setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, updatePosition, searchable]);

  const handleSelect = (option) => {
    if (multiple) {
      const current = Array.isArray(normalizedValue) ? normalizedValue : [];
      onChange?.(
        current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value],
      );
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearch("");
  };

  const renderValue = () => {
    if (externalRenderValue) return externalRenderValue();
    const sels = multiple
      ? selectedOptions || []
      : [selectedOptions].filter(Boolean);
      
    if (sels.length === 0)
      return (
        <span className="ds-select__value--placeholder text-muted opacity-60">{placeholder}</span>
      );

    if (multiple)
      return (
        <div className="ds-select__chips">
          {sels.slice(0, 4).map((o) => (
            <span key={o.value} className="ds-select__chip">
              {o.label}
            </span>
          ))}
          {sels.length > 4 && (
            <span className="ds-select__more">+{sels.length - 4} more</span>
          )}
        </div>
      );

    return <span className="ds-select__value font-bold text-primary">{sels[0].label}</span>;
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
      <SelectTrigger
        isOpen={isOpen}
        disabled={disabled}
        error={error}
        multiple={multiple}
        Icon={Icon}
        value={normalizedValue}
        renderValue={renderValue}
        placeholder={placeholder}
        clearable={clearable}
        onClear={(e) => {
          e.stopPropagation();
          onChange?.(multiple ? [] : "");
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      />
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
            >
              {searchable && (
                <div className="ds-select__search">
                  <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="ds-select__search-input"
                  />
                </div>
              )}
              <div className="ds-select__options">
                {filteredOptions.length ? (
                  filteredOptions.map((o) => (
                    <SelectOption
                      key={o.value}
                      option={o}
                      isSelected={isSelected(o.value)}
                      multiple={multiple}
                      renderOption={renderOption}
                      onClick={handleSelect}
                    />
                  ))
                ) : (
                  <div className="ds-select__empty">No options found</div>
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
