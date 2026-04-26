import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@lib/cn";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePickerDropdown({
  coords,
  viewDate,
  selectedDate,
  handlePrevMonth,
  handleNextMonth,
  handleSelectDate,
  isDisabledDate,
  placement = "bottom",
}) {
  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start, end });
  const paddingDays = Array(start.getDay()).fill(null);

  const topOffset = placement === "top" ? -8 : 8;

  return (
    <div
      className="ds-datepicker__dropdown ds-datepicker-portal"
      style={{
        position: "fixed",
        top: `${coords.top + topOffset}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="ds-datepicker__header">
        <button
          type="button"
          className="ds-datepicker__nav"
          onClick={handlePrevMonth}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="ds-datepicker__month-year">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          className="ds-datepicker__nav"
          onClick={handleNextMonth}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="ds-datepicker__days-header">
        {DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="ds-datepicker__days">
        {paddingDays.map((_, i) => (
          <span key={`pad-${i}`} className="ds-datepicker__day--empty" />
        ))}
        {days.map((day) => (
          <button
            key={day.toISOString()}
            type="button"
            className={cn(
              "ds-datepicker__day",
              isToday(day) && "ds-datepicker__day--today",
              selectedDate &&
                isSameDay(day, selectedDate) &&
                "ds-datepicker__day--selected",
              isDisabledDate(day) && "ds-datepicker__day--disabled",
            )}
            onClick={() => handleSelectDate(day)}
            disabled={isDisabledDate(day)}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}
