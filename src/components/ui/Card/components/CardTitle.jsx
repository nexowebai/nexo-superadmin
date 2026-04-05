import { cn } from '@lib/cn';

export function CardTitle({ children, className, as: Component = 'h3', ...props }) {
    return (
        <Component className={cn('ds-card__title', className)} {...props}>
            {children}
        </Component>
    );
}

export default CardTitle;
