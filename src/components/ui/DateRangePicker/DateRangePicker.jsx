import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { cn } from "@lib/cn";
import { Button } from "@components/ui";
import { PRESETS, CalendarGrid } from "./components/DateRangeComponents";
import "./DateRangePicker.css";

export default function DateRangePicker({
  initialStartDate,
  initialEndDate,
  onChange,
  className,
  align = "left",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("preset");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [tempStartDate, setTempStartDate] = useState(initialStartDate);
  const [tempEndDate, setTempEndDate] = useState(initialEndDate);
  const [monthDate, setMonthDate] = useState(initialStartDate || new Date());
  const [hoverDate, setHoverDate] = useState(null);

  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setTempStartDate(initialStartDate);
    setTempEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const handleDateClick = (date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else if (tempStartDate && !tempEndDate) {
      if (isSameDay(date, tempStartDate)) {
          setTempStartDate(null);
          return;
      }
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handleApply = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    onChange({ startDate: tempStartDate, endDate: tempEndDate });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
    setViewMode("preset");
  };

  const handlePreset = (preset) => {
    const [s, e] = preset.getValue();
    setTempStartDate(s);
    setTempEndDate(e);
    setMonthDate(s);
  };

  return (
    <div className={cn("drp-container", className)} ref={containerRef}>
      <button
        type="button"
        className={cn("drp-trigger", isOpen && "active")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon size={16} className="drp-icon" />
        <span className="drp-value">
          {startDate ? (
            <>
              {format(startDate, "MMM d, yyyy")}
              {endDate && ` - ${format(endDate, "MMM d, yyyy")}`}
            </>
          ) : (
            "Select Date Range"
          )}
        </span>
        {startDate && (
          <div className="drp-clear-btn" onClick={(e) => {
              e.stopPropagation();
              setStartDate(null);
              setEndDate(null);
              setTempStartDate(null);
              setTempEndDate(null);
              onChange({ startDate: null, endDate: null });
          }}>
            <X size={12} />
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "drp-popover", 
            viewMode === 'custom' ? "is-custom" : "is-preset",
            align === 'end' ? "align-end" : "align-start"
          )}
        >
          <div className="drp-content">
            <div className="drp-sidebar">
              <div className="drp-sidebar-header">Timeframes</div>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  className="drp-preset-btn"
                  onClick={() => {
                      handlePreset(p);
                      setViewMode("preset");
                  }}
                >
                  {p.label}
                </button>
              ))}
              <button 
                className={cn("drp-preset-btn", viewMode === 'custom' && "active")}
                onClick={() => setViewMode("custom")}
              >
                Custom Range
              </button>
            </div>

            <div className="drp-main">
              <div className="drp-header">
                <button className="drp-nav-btn" onClick={() => setMonthDate(subMonths(monthDate, 1))}>
                  <ChevronLeft size={18} />
                </button>
                <div className="drp-current-month">
                  {viewMode === 'custom' 
                    ? `${format(monthDate, "MMM yyyy")} - ${format(addMonths(monthDate, 1), "MMM yyyy")}`
                    : format(monthDate, "MMMM yyyy")
                  }
                </div>
                <button className="drp-nav-btn" onClick={() => setMonthDate(addMonths(monthDate, 1))}>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="drp-calendars-wrapper">
                <CalendarGrid
                  monthDate={monthDate}
                  startDate={tempStartDate}
                  endDate={tempEndDate}
                  hoverDate={hoverDate}
                  onDateClick={handleDateClick}
                  onDateHover={setHoverDate}
                />
                {viewMode === 'custom' && (
                  <CalendarGrid
                    monthDate={addMonths(monthDate, 1)}
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    hoverDate={hoverDate}
                    onDateClick={handleDateClick}
                    onDateHover={setHoverDate}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="drp-footer">
            <div className="drp-actions-grid">
              <Button variant="soft" onClick={handleCancel} className="flex-1">Cancel</Button>
              <Button 
                variant="primary" 
                onClick={handleApply} 
                disabled={!tempStartDate || !tempEndDate}
                className="flex-1 shadow-none"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
