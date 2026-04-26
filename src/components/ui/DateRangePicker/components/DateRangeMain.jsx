import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { CalendarGrid } from "./DateRangeComponents";

export function DateRangeMain({ 
  viewMode, 
  monthDate, 
  setMonthDate, 
  tempStartDate, 
  tempEndDate, 
  hoverDate, 
  handleDateClick, 
  setHoverDate 
}) {
  return (
    <div className="drp-main">
      <div className="drp-header">
        <button
          className="drp-nav-btn"
          onClick={() => setMonthDate(subMonths(monthDate, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="drp-current-month">
          {viewMode === "custom"
            ? `${format(monthDate, "MMM yyyy")} - ${format(addMonths(monthDate, 1), "MMM yyyy")}`
            : format(monthDate, "MMMM yyyy")}
        </div>
        <button
          className="drp-nav-btn"
          onClick={() => setMonthDate(addMonths(monthDate, 1))}
        >
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
        {viewMode === "custom" && (
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
  );
}
