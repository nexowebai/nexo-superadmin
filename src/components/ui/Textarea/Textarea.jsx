import { forwardRef, useId, useState } from 'react';
import { cn } from '@lib/cn';
import './Textarea.css';

const Textarea = forwardRef(({
    label,
    error,
    hint,
    icon: Icon,
    fullWidth = true,
    className,
    wrapperClassName,
    disabled,
    rows = 4,
    maxLength,
    showCount = false,
    id: propId,
    value,
    onChange,
    ...props
}, ref) => {
    const generatedId = useId();
    const textareaId = propId || generatedId;
    const [charCount, setCharCount] = useState(value?.length || 0);

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) return;
        setCharCount(newValue.length);
        onChange?.(e);
    };

    return (
        <div className={cn('ds-textarea-wrapper', fullWidth && 'ds-textarea-wrapper--full', wrapperClassName)}>
            {label && (
                <label htmlFor={textareaId} className="ds-textarea-label">
                    {label}
                    {props.required && <span className="ds-textarea-required">*</span>}
                </label>
            )}

            <div className={cn('ds-textarea-container', error && 'ds-textarea-container--error', disabled && 'ds-textarea-container--disabled')}>
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    value={value}
                    onChange={handleChange}
                    maxLength={maxLength}
                    className={cn('ds-textarea', className)}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error || hint ? `${textareaId}-message` : undefined}
                    {...props}
                />
                {(showCount || maxLength) && (
                    <div className="ds-textarea-count">
                        {charCount}{maxLength && `/${maxLength}`}
                    </div>
                )}
            </div>

            {(error || hint) && (
                <span
                    id={`${textareaId}-message`}
                    className={cn('ds-textarea-message', error && 'ds-textarea-message--error')}
                >
                    {error || hint}
                </span>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
