import { cn } from '@lib/cn';

export function CardHeader({ children, className, ...props }) {
    return (
        <div className={cn('ds-card__header', className)} {...props}>
            {children}
        </div>
    );
}

export default CardHeader;
