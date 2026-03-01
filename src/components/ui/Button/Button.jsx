import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@lib/cn';
import './Button.css';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    iconPosition = 'left',
    fullWidth = false,
    type = 'button',
    className,
    ...props
}, ref) => {
    const isDisabled = disabled || loading;
    const LIcon = LeftIcon || (iconPosition === 'left' ? Icon : null);
    const RIcon = RightIcon || (iconPosition === 'right' ? Icon : null);

    return (
        <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            className={cn(
                'ds-button',
                `ds-button--${variant}`,
                `ds-button--${size}`,
                fullWidth && 'ds-button--full',
                isDisabled && 'ds-button--disabled',
                className
            )}
            {...props}
        >
            {loading && (
                <Loader2 className="ds-button__loader" />
            )}

            {!loading && LIcon && (
                <LIcon className="ds-button__icon ds-button__icon--left" />
            )}

            <span className="ds-button__label">{children}</span>

            {!loading && RIcon && (
                <RIcon className="ds-button__icon ds-button__icon--right" />
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
