import { useState, useRef, useEffect, useCallback } from "react";
import { subMonths, addMonths, format } from "date-fns";

export function useDatePicker({ value, onChange, minDate, maxDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date(),
  );
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left, width: rect.width });
    }
  }, [isOpen]);

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
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !e.target.closest(".ds-datepicker-portal")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(addMonths(viewDate, 1));
  };

  const handleSelectDate = (day) => {
    if (minDate && day < new Date(minDate).setHours(0, 0, 0, 0)) return;
    if (maxDate && day > new Date(maxDate).setHours(23, 59, 59, 999)) return;
    onChange?.(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const isDisabledDate = (day) => {
    const d = new Date(day).setHours(0, 0, 0, 0);
    if (minDate && d < new Date(minDate).setHours(0, 0, 0, 0)) return true;
    if (maxDate && d > new Date(maxDate).setHours(23, 59, 59, 999)) return true;
    return false;
  };

  return {
    isOpen,
    setIsOpen,
    viewDate,
    setViewDate,
    coords,
    containerRef,
    triggerRef,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    isDisabledDate,
  };
}
