import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { cn } from '@lib/cn';
import './DatePicker.css';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function DatePicker({
    label,
    value,
    onChange,
    placeholder = 'Select date',
    minDate,
    maxDate,
    disabled = false,
    error,
    icon: Icon = Calendar,
    id: propId,
    className,
}) {
    const generatedId = useId();
    const pickerId = propId || generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);
    const triggerRef = useRef(null);

    const updatePosition = useCallback(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, updatePosition]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target) &&
                !e.target.closest('.ds-datepicker-portal')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedDate = value ? new Date(value) : null;
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const days = eachDayOfInterval({ start, end });
    const startDay = start.getDay();
    const paddingDays = Array(startDay).fill(null);

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
        onChange?.(format(day, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const isDisabledDate = (day) => {
        const d = new Date(day).setHours(0, 0, 0, 0);
        if (minDate && d < new Date(minDate).setHours(0, 0, 0, 0)) return true;
        if (maxDate && d > new Date(maxDate).setHours(23, 59, 59, 999)) return true;
        return false;
    };

    const dropdownContent = (
        <div
            className="ds-datepicker__dropdown ds-datepicker-portal"
            style={{
                position: 'fixed',
                top: `${coords.top + 8}px`,
                left: `${coords.left}px`,
                zIndex: 9999
            }}
            onMouseDown={e => e.stopPropagation()}
        >
            <div className="ds-datepicker__header">
                <button type="button" className="ds-datepicker__nav" onClick={handlePrevMonth}>
                    <ChevronLeft size={18} />
                </button>
                <span className="ds-datepicker__month-year">
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button type="button" className="ds-datepicker__nav" onClick={handleNextMonth}>
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="ds-datepicker__days-header">
                {DAYS.map(day => <span key={day}>{day}</span>)}
            </div>

            <div className="ds-datepicker__days">
                {paddingDays.map((_, i) => <span key={`pad-${i}`} className="ds-datepicker__day--empty" />)}
                {days.map(day => (
                    <button
                        key={day.toISOString()}
                        type="button"
                        className={cn(
                            'ds-datepicker__day',
                            isToday(day) && 'ds-datepicker__day--today',
                            selectedDate && isSameDay(day, selectedDate) && 'ds-datepicker__day--selected',
                            isDisabledDate(day) && 'ds-datepicker__day--disabled'
                        )}
                        onClick={() => handleSelectDate(day)}
                        disabled={isDisabledDate(day)}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className={cn('ds-datepicker', className)} ref={containerRef}>
            {label && (
                <label htmlFor={pickerId} className="ds-datepicker__label">
                    {label}
                </label>
            )}
            <button
                ref={triggerRef}
                type="button"
                id={pickerId}
                className={cn(
                    'ds-datepicker__trigger',
                    isOpen && 'ds-datepicker__trigger--open',
                    error && 'ds-datepicker__trigger--error',
                    disabled && 'ds-datepicker__trigger--disabled'
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <Icon size={18} className="ds-datepicker__icon" />
                <span className={cn('ds-datepicker__value', !selectedDate && 'ds-datepicker__value--placeholder')}>
                    {selectedDate ? format(selectedDate, 'MMM d, yyyy') : placeholder}
                </span>
            </button>

            {isOpen && createPortal(dropdownContent, document.body)}

            {error && <span className="ds-datepicker__error">{error}</span>}
        </div>
    );
}

export default DatePicker;
