import { forwardRef, useId } from 'react';
import { cn } from '@lib/cn';
import './Input.css';

const Input = forwardRef(({
    label,
    error,
    hint,
    icon: Icon,
    rightIcon: RightIcon,
    onRightIconClick,
    iconPosition = 'left',
    size = 'md',
    variant = 'default',
    fullWidth = true,
    className,
    wrapperClassName,
    disabled,
    id: propId,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = propId || generatedId;

    return (
        <div className={cn('ds-input-wrapper', fullWidth && 'ds-input-wrapper--full', wrapperClassName)}>
            {label && (
                <label htmlFor={inputId} className="ds-input-label">
                    {label}
                    {props.required && <span className="ds-input-required">*</span>}
                </label>
            )}

            <div className={cn(
                'ds-input-container',
                `ds-input-container--${size}`,
                Icon && `ds-input-container--icon-left`,
                RightIcon && `ds-input-container--icon-right`,
                error && 'ds-input-container--error',
                disabled && 'ds-input-container--disabled'
            )}>
                {Icon && (
                    <span className="ds-input-icon ds-input-icon--left">
                        <Icon size={18} />
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={cn('ds-input', `ds-input--${variant}`, className)}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error || hint ? `${inputId}-message` : undefined}
                    {...props}
                />

                {RightIcon && (
                    <button
                        type="button"
                        className="ds-input-icon ds-input-icon--right ds-input-icon--clickable"
                        onClick={onRightIconClick}
                        tabIndex={-1}
                    >
                        <RightIcon size={18} />
                    </button>
                )}
            </div>

            {(error || hint) && (
                <span
                    id={`${inputId}-message`}
                    className={cn('ds-input-message', error && 'ds-input-message--error')}
                >
                    {error || hint}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
