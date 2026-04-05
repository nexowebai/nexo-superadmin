import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { cn } from "@lib/cn";
import "./MultiSelect.css";

function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  label,
  error,
  disabled = false,
  searchable = true,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

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

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (searchable && inputRef.current) inputRef.current.focus();
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, handleClickOutside, searchable]);

  const handleSelect = (option) => {
    const newValue = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];
    onChange?.(newValue);
  };

  const handleRemove = (e, optValue) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optValue));
  };

  return (
    <div className={cn("ds-multi-select", className)} ref={containerRef}>
      {label && <label className="ds-multi-select__label">{label}</label>}
      <button
        type="button"
        className={cn(
          "ds-multi-select__trigger",
          isOpen && "ds-multi-select__trigger--open",
          error && "ds-multi-select__trigger--error",
          disabled && "ds-multi-select__trigger--disabled",
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="ds-multi-select__value">
          {selectedOptions.length === 0 ? (
            <span className="ds-multi-select__placeholder">{placeholder}</span>
          ) : (
            <div className="ds-multi-select__chips">
              {selectedOptions.slice(0, 2).map((opt) => (
                <span key={opt.value} className="ds-multi-select__chip">
                  {opt.label}
                  <X size={12} onClick={(e) => handleRemove(e, opt.value)} />
                </span>
              ))}
              {selectedOptions.length > 2 && (
                <span className="ds-multi-select__more">
                  +{selectedOptions.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "ds-multi-select__chevron",
            isOpen && "ds-multi-select__chevron--open",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ds-multi-select__dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {searchable && (
              <div className="ds-multi-select__search">
                <Search size={14} />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="ds-multi-select__search-input"
                />
              </div>
            )}
            <div className="ds-multi-select__options">
              {filteredOptions.length === 0 ? (
                <div className="ds-multi-select__empty">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "ds-multi-select__option",
                      value.includes(option.value) &&
                        "ds-multi-select__option--selected",
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="ds-multi-select__checkbox">
                      {value.includes(option.value) && <Check size={12} />}
                    </div>
                    <span>{option.label}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <span className="ds-multi-select__error">{error}</span>}
    </div>
  );
}

export default MultiSelect;
