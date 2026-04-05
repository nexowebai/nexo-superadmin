import { cn } from '@lib/cn';

export function CardFooter({ children, className, ...props }) {
    return (
        <div className={cn('ds-card__footer', className)} {...props}>
            {children}
        </div>
    );
}

export default CardFooter;
