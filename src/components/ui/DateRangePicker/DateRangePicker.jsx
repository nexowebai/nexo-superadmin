import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@lib/cn";
import { Button } from "@components/ui";
import { DateRangeSidebar } from "./components/DateRangeSidebar";
import { DateRangeMain } from "./components/DateRangeMain";
import "./DateRangePicker.css";

export default function DateRangePicker({
  initialStartDate, initialEndDate, onChange, className, align = "left",
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setStartDate(initialStartDate); setEndDate(initialEndDate);
    setTempStartDate(initialStartDate); setTempEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const handleDateClick = (date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date); setTempEndDate(null);
    } else if (tempStartDate && !tempEndDate) {
      if (isSameDay(date, tempStartDate)) { setTempStartDate(null); return; }
      if (date < tempStartDate) { setTempEndDate(tempStartDate); setTempStartDate(date); } 
      else setTempEndDate(date);
    }
  };

  const handleApply = () => {
    setStartDate(tempStartDate); setEndDate(tempEndDate);
    onChange({ startDate: tempStartDate, endDate: tempEndDate });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate); setTempEndDate(endDate);
    setIsOpen(false); setViewMode("preset");
  };

  return (
    <div className={cn("drp-container", className)} ref={containerRef}>
      <button type="button" className={cn("drp-trigger", isOpen && "active")} onClick={() => setIsOpen(!isOpen)}>
        <CalendarIcon size={16} className="drp-icon" />
        <span className="drp-value">
          {startDate ? <>{format(startDate, "MMM d, yyyy")}{endDate && ` - ${format(endDate, "MMM d, yyyy")}`}</> : "Select Date Range"}
        </span>
        {startDate && (
          <div className="drp-clear-btn" onClick={(e) => {
            e.stopPropagation(); setStartDate(null); setEndDate(null);
            setTempStartDate(null); setTempEndDate(null);
            onChange({ startDate: null, endDate: null });
          }}>
            <X size={12} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className={cn("drp-popover", viewMode === "custom" ? "is-custom" : "is-preset", align === "end" ? "align-end" : "align-start")}>
          <div className="drp-content">
            <DateRangeSidebar viewMode={viewMode} setViewMode={setViewMode} handlePreset={(p) => {
              const [s, e] = p.getValue(); setTempStartDate(s); setTempEndDate(e); setMonthDate(s);
            }} />
            <DateRangeMain viewMode={viewMode} monthDate={monthDate} setMonthDate={setMonthDate}
              tempStartDate={tempStartDate} tempEndDate={tempEndDate} hoverDate={hoverDate}
              handleDateClick={handleDateClick} setHoverDate={setHoverDate} />
          </div>
          <div className="drp-footer">
            <div className="drp-actions-grid">
              <Button variant="soft" onClick={handleCancel} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleApply} disabled={!tempStartDate || !tempEndDate} className="flex-1 shadow-none">Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
