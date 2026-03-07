import { Skeleton } from '../ui/Skeleton/Skeleton';

export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="w-full space-y-3">
            <div className="flex gap-4 items-center pb-3 border-b border-base">
                {Array.from({ length: cols }).map((_, j) => (
                    <Skeleton key={j} height="14px" className="flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center py-2">
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton
                            key={j}
                            height="16px"
                            className="flex-1"
                            width={j === 0 ? '80%' : '60%'}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton({ lines = 3 }) {
    return (
        <div className="bg-surface border border-base rounded-md p-6 space-y-4">
            <Skeleton width="50%" height="20px" />
            <Skeleton width="100%" height="100px" borderRadius="var(--radius-md)" />
            {lines > 2 && (
                <div className="flex gap-3">
                    <Skeleton width="100px" height="36px" borderRadius="var(--radius-md)" />
                    <Skeleton width="100px" height="36px" borderRadius="var(--radius-md)" />
                </div>
            )}
        </div>
    );
}

export function StatsRowSkeleton({ count = 4 }) {
    return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-surface border border-base rounded-md p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton width="40px" height="40px" borderRadius="var(--radius-md)" />
                        <Skeleton width="60px" height="14px" />
                    </div>
                    <Skeleton width="70px" height="28px" />
                    <Skeleton width="100px" height="12px" />
                </div>
            ))}
        </div>
    );
}

export function TablePageSkeleton({ statsCount = 4 }) {
    return (
        <div className="space-y-6">
            <StatsRowSkeleton count={statsCount} />
            <div className="bg-surface border border-base rounded-md p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton width="200px" height="40px" borderRadius="var(--radius-md)" />
                    <div className="flex gap-3">
                        <Skeleton width="120px" height="40px" borderRadius="var(--radius-md)" />
                        <Skeleton width="100px" height="40px" borderRadius="var(--radius-md)" />
                    </div>
                </div>
                <TableSkeleton rows={6} cols={5} />
            </div>
        </div>
    );
}
