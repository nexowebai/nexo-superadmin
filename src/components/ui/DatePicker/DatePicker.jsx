import { useId } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@lib/cn';
import { useDatePicker } from './hooks/useDatePicker';
import { DatePickerDropdown } from './components/DatePickerDropdown';
import './styles/DatePicker.css';

function DatePicker({
    label, value, onChange, placeholder = 'Select date',
    minDate, maxDate, disabled = false, error,
    icon: Icon = Calendar, id: propId, className,
}) {
    const generatedId = useId();
    const pickerId = propId || generatedId;
    const {
        isOpen, setIsOpen, viewDate, coords, containerRef, triggerRef,
        handlePrevMonth, handleNextMonth, handleSelectDate, isDisabledDate
    } = useDatePicker({ value, onChange, minDate, maxDate });

    const selectedDate = value ? new Date(value) : null;

    return (
        <div className={cn('ds-datepicker', className)} ref={containerRef}>
            {label && <label htmlFor={pickerId} className="ds-datepicker__label">{label}</label>}
            <button
                ref={triggerRef} type="button" id={pickerId}
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

            {isOpen && createPortal(
                <DatePickerDropdown
                    coords={coords}
                    viewDate={viewDate}
                    selectedDate={selectedDate}
                    handlePrevMonth={handlePrevMonth}
                    handleNextMonth={handleNextMonth}
                    handleSelectDate={handleSelectDate}
                    isDisabledDate={isDisabledDate}
                />,
                document.body
            )}

            {error && <span className="ds-datepicker__error">{error}</span>}
        </div>
    );
}

export default DatePicker;
