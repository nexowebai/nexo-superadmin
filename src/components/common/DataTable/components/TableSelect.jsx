import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@lib/cn";
import "./../styles/TableSelect.css";

/**
 * A lightweight, local Select component for the DataTable pagination.
 * Avoids dependency on global UI Select to keep the DataTable self-contained.
 */
export const TableSelect = ({ options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={cn("dt-select-container", className)} ref={containerRef}>
      <button
        type="button"
        className={cn("dt-select-trigger", isOpen && "is-open")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={14} className="dt-select-chevron" />
      </button>

      {isOpen && (
        <div className="dt-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              className={cn(
                "dt-select-option",
                option.value === value && "is-selected"
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
