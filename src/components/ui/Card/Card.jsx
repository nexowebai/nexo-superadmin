import { forwardRef } from 'react';
import { cn } from '@lib/cn';
import './Card.css';

const Card = forwardRef(({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    className,
    onClick,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'ds-card',
                `ds-card--${variant}`,
                `ds-card--padding-${padding}`,
                hover && 'ds-card--hoverable',
                onClick && 'ds-card--clickable',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

function CardHeader({ children, className, ...props }) {
    return (
        <div className={cn('ds-card__header', className)} {...props}>
            {children}
        </div>
    );
}

function CardTitle({ children, className, as: Component = 'h3', ...props }) {
    return (
        <Component className={cn('ds-card__title', className)} {...props}>
            {children}
        </Component>
    );
}

function CardDescription({ children, className, ...props }) {
    return (
        <p className={cn('ds-card__description', className)} {...props}>
            {children}
        </p>
    );
}

function CardContent({ children, className, ...props }) {
    return (
        <div className={cn('ds-card__content', className)} {...props}>
            {children}
        </div>
    );
}

function CardFooter({ children, className, ...props }) {
    return (
        <div className={cn('ds-card__footer', className)} {...props}>
            {children}
        </div>
    );
}
function CardSkeleton({ lines = 3, showHeader = true, variant = 'text', height = 200, className }) {
    return (
        <div className={cn('ds-card ds-card--padding-md', className)}>
            {showHeader && (
                <div className="ds-card__header">
                    <div className="ds-skeleton ds-skeleton--title" />
                    <div className="ds-skeleton ds-skeleton--text ds-skeleton--w-60" />
                </div>
            )}
            <div className="ds-card__content">
                {variant === 'chart' ? (
                    <div className="ds-skeleton ds-skeleton--rect" style={{ height: height, width: '100%' }} />
                ) : (
                    Array.from({ length: lines }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'ds-skeleton ds-skeleton--text',
                                i === lines - 1 && 'ds-skeleton--w-75'
                            )}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Card;
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardSkeleton };
