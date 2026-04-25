import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { cn } from "@lib/cn";

export const PRESETS = [
  { label: "Today", getValue: () => [new Date(), new Date()] },
  {
    label: "Yesterday",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return [d, d];
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return [d, new Date()];
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      return [d, new Date()];
    },
  },
  {
    label: "This Month",
    getValue: () => [startOfMonth(new Date()), new Date()],
  },
];

export function CalendarGrid({
  monthDate,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(monthDate)),
    end: endOfWeek(endOfMonth(monthDate)),
  });
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="drp-calendar">
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
            const [s, e] =
              startDate < hoverDate
                ? [startDate, hoverDate]
                : [hoverDate, startDate];
            isHoverRange =
              isWithinInterval(day, { start: s, end: e }) &&
              !isSameDay(day, startDate);
          }
          return (
            <button
              key={idx}
              onClick={() => onDateClick(day)}
              onMouseEnter={() => onDateHover(day)}
              disabled={!isCurrentMonth}
              type="button"
              className={cn(
                "drp-day",
                !isCurrentMonth && "outside",
                isSelectedStart && "selected start",
                isSelectedEnd && "selected end",
                isInRange && "in-range",
                isHoverRange && "in-hover-range",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
