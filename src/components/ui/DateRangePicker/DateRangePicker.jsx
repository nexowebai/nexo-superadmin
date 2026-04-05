import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isBefore,
  isValid,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/cn";
import Button from "../Button";
import { PRESETS, CalendarGrid } from "./components/DateRangeComponents";
import "./DateRangePicker.css";

function DateRangePicker({
  onChange,
  initialStartDate,
  initialEndDate,
  className,
  align = "start",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [hoverDate, setHoverDate] = useState(null);
  const [viewDate, setViewDate] = useState(startOfMonth(new Date()));
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (initialStartDate) setStartDate(initialStartDate);
    if (initialEndDate) setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const updatePosition = useCallback(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: align === "end" ? rect.right - 700 : rect.left,
      });
    }
  }, [isOpen, align]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !e.target.closest(".drp-popover")
      )
        setIsOpen(false);
    };
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, updatePosition]);

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (isBefore(date, startDate)) {
      setEndDate(startDate);
      setStartDate(date);
    } else setEndDate(date);
  };

  const handleApply = () => {
    onChange?.({ startDate, endDate });
    setIsOpen(false);
  };
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange?.({ startDate: null, endDate: null });
  };

  const popoverContent = (
    <motion.div
      className={cn(
        "drp-popover",
        align === "end" ? "align-end" : "align-start",
      )}
      style={{ position: "fixed", top: coords.top, left: coords.left }}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
    >
      <div className="drp-content">
        <div className="drp-sidebar">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              className="drp-preset-btn"
              onClick={() => {
                const [s, e] = p.getValue();
                setStartDate(s);
                setEndDate(e);
                setViewDate(startOfMonth(e));
              }}
              type="button"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="drp-main">
          <div className="drp-header">
            <button
              onClick={() => setViewDate(subMonths(viewDate, 1))}
              type="button"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="drp-header-spacer" />
            <button
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="drp-calendars">
            <CalendarGrid
              monthDate={viewDate}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
            />
            <CalendarGrid
              monthDate={addMonths(viewDate, 1)}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
            />
          </div>
          <div className="drp-footer">
            <div className="drp-footer-info">
              {startDate && format(startDate, "MMM d, yyyy")}{" "}
              {startDate && endDate && " - "}{" "}
              {endDate && format(endDate, "MMM d, yyyy")}
            </div>
            <div className="drp-actions">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                size="sm"
                disabled={!startDate || !endDate}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={cn("drp-container", className)} ref={containerRef}>
      <button
        ref={triggerRef}
        className={cn("drp-trigger", isOpen && "active")}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <CalendarIcon size={18} className="drp-icon" />
        <span className="drp-value">
          {startDate && endDate
            ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
            : "Select Range"}
        </span>
        {startDate && (
          <div
            className="drp-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            <X size={14} />
          </div>
        )}
      </button>
      <AnimatePresence>
        {isOpen && createPortal(popoverContent, document.body)}
      </AnimatePresence>
    </div>
  );
}

export default DateRangePicker;
