import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
  subDays,
  isAfter,
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
import "./DateRangePicker.css";

const PRESETS = [
  {
    label: "Today",
    getValue: () => [startOfDay(new Date()), endOfDay(new Date())],
  },
  {
    label: "Yesterday",
    getValue: () => [
      startOfDay(subDays(new Date(), 1)),
      endOfDay(subDays(new Date(), 1)),
    ],
  },
  {
    label: "Last 7 Days",
    getValue: () => [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
  },
  {
    label: "Last 30 Days",
    getValue: () => [startOfDay(subDays(new Date(), 29)), endOfDay(new Date())],
  },
  {
    label: "This Month",
    getValue: () => [startOfMonth(new Date()), endOfDay(new Date())],
  },
  {
    label: "Last Month",
    getValue: () => [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
];

function CalendarGrid({
  monthDate,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthStart);
  const startDateGrid = startOfWeek(monthStart);
  const endDateGrid = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDateGrid, end: endDateGrid });
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="drp-calendar">
      <div className="drp-month-title">{format(monthDate, "MMMM yyyy")}</div>
      <div className="drp-weekdays">
        {weekDays.map((d) => (
          <div key={d} className="drp-weekday">
            {d}
          </div>
        ))}
      </div>
      <div className="drp-days">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthDate);
          const isSelectedStart = startDate && isSameDay(day, startDate);
          const isSelectedEnd = endDate && isSameDay(day, endDate);
          const isInRange =
            startDate &&
            endDate &&
            isWithinInterval(day, { start: startDate, end: endDate });

          let isHoverRange = false;
          if (startDate && !endDate && hoverDate) {
            const start = startDate < hoverDate ? startDate : hoverDate;
            const end = startDate < hoverDate ? hoverDate : startDate;
            isHoverRange =
              isWithinInterval(day, { start, end }) &&
              !isSameDay(day, startDate);
          }

          return (
            <button
              key={idx}
              onClick={() => onDateClick(day)}
              onMouseEnter={() => onDateHover(day)}
              className={cn(
                "drp-day",
                !isCurrentMonth && "outside",
                isSelectedStart && "selected start",
                isSelectedEnd && "selected end",
                isInRange && "in-range",
                isHoverRange && "in-hover-range",
              )}
              disabled={!isCurrentMonth}
              type="button"
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.closest(".drp-popover")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (isBefore(date, startDate)) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handlePresetClick = (preset) => {
    const [start, end] = preset.getValue();
    setStartDate(start);
    setEndDate(end);
    setViewDate(startOfMonth(end));
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

  const toggleOpen = () => setIsOpen(!isOpen);
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));
  const nextMonth = () => setViewDate(addMonths(viewDate, 1));

  const displayValue =
    startDate && endDate
      ? `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
      : "Select Date Range";

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
      transition={{ duration: 0.15 }}
    >
      <div className="drp-content">
        <div className="drp-sidebar">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              className="drp-preset-btn"
              onClick={() => handlePresetClick(preset)}
              type="button"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="drp-main">
          <div className="drp-header">
            <button className="drp-nav-btn" onClick={prevMonth} type="button">
              <ChevronLeft size={20} />
            </button>
            <div className="drp-header-spacer" />
            <button className="drp-nav-btn" onClick={nextMonth} type="button">
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
              {startDate && format(startDate, "MMM d, yyyy")}
              {startDate && endDate && " - "}
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
        onClick={toggleOpen}
        type="button"
      >
        <CalendarIcon size={18} className="drp-icon" />
        <span className="drp-value">{displayValue}</span>
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
