import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/cn";
import {
  SelectTrigger,
  SelectOption,
} from "./components/SelectComponents";
import "./Select.css";

const getVariants = (isUp) => ({
  hidden: {
    opacity: 0,
    y: isUp ? 15 : -15,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", duration: 0.35, bounce: 0 },
  },
  exit: {
    opacity: 0,
    y: isUp ? 10 : -10,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
});

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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, isUp: false, maxHeight: 300 });
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const normalizedValue = value ?? (multiple ? [] : "");

  const isSelected = (val) =>
    multiple 
      ? Array.isArray(normalizedValue) && normalizedValue.includes(val) 
      : normalizedValue === val;

  const filteredOptions =
    searchable && search
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      const shouldOpenUp = spaceBelow < 380 && spaceAbove > spaceBelow;
      
      setCoords({
        top: shouldOpenUp ? rect.top - 10 : rect.bottom + 10,
        left: rect.left,
        width: rect.width,
        isUp: shouldOpenUp,
        maxHeight: Math.min(400, shouldOpenUp ? spaceAbove - 20 : spaceBelow - 20)
      });
    }
  }, []);

  useEffect(() => {
    const handleEvents = (e) => {
      if (!isOpen) return;
      const isInside = containerRef.current?.contains(e.target) || dropdownRef.current?.contains(e.target);
      if (!isInside) setIsOpen(false);
    };

    const handleScroll = (e) => {
      if (isOpen && !dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      updatePosition();
      document.addEventListener("mousedown", handleEvents, true);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", () => setIsOpen(false));
      if (searchable) setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      document.removeEventListener("mousedown", handleEvents, true);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", () => setIsOpen(false));
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
      ? options.filter((o) => Array.isArray(normalizedValue) && normalizedValue.includes(o.value))
      : [options.find((o) => o.value === normalizedValue)].filter(Boolean);
      
    if (sels.length === 0)
      return <span className="ds-select__value--placeholder">{placeholder}</span>;

    if (multiple)
      return (
        <div className="ds-select__chips">
          {sels.slice(0, 2).map((o) => (
            <span key={o.value} className="ds-select__chip">{o.label}</span>
          ))}
          {sels.length > 2 && <span className="ds-select__more">+{sels.length - 2}</span>}
        </div>
      );

    return <span className="ds-select__value">{sels[0].label}</span>;
  };

  return (
    <div
      className={cn("ds-select", fullWidth && "ds-select--full", className)}
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
        size={size}
        onClear={(e) => {
          e.stopPropagation();
          onChange?.(multiple ? [] : "");
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
      />
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="select-dropdown"
            ref={dropdownRef}
            className={cn("ds-select-portal-menu", coords.isUp && "ds-select-portal-menu--up")}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              width: "100%",
              zIndex: 1000,
              maxHeight: 300,
              pointerEvents: "auto",
              transformOrigin: "top"
            }}
            variants={getVariants(false)}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {searchable && (
              <div className="ds-select-portal-search">
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search options..."
                  className="ds-select-portal-search-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div 
              className="ds-select-portal-options"
              style={{ maxHeight: 240 }}
            >
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
                <div className="ds-select-portal-empty">No options found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <span className="ds-select__error">{error}</span>}
    </div>
  );
}

export default Select;
