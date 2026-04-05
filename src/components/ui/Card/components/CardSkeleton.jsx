import { cn } from '@lib/cn';

export function CardSkeleton({ lines = 3, showHeader = true, variant = 'text', height = 200, className }) {
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

export default CardSkeleton;
