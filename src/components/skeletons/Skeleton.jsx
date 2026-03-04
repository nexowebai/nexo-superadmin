import React from 'react';
import { cn } from '@lib/cn';

/**
 * Premium Skeleton component for loading states.
 * Supports pulsing animation and various shapes.
 */
export const Skeleton = ({
    className,
    width,
    height,
    borderRadius = 'var(--radius-md)',
    variant = 'pulse'
}) => {
    return (
        <div
            className={cn(
                'ds-skeleton',
                variant === 'pulse' && 'ds-skeleton--pulse',
                className
            )}
            style={{
                width,
                height,
                borderRadius,
                backgroundColor: 'var(--bg-elevated)',
            }}
        />
    );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="w-full space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
                {Array.from({ length: cols }).map((_, j) => (
                    <Skeleton key={j} height="40px" className="flex-1" />
                ))}
            </div>
        ))}
    </div>
);

export const CardSkeleton = () => (
    <div className="settings-card p-6 space-y-4">
        <Skeleton width="60%" height="24px" />
        <Skeleton width="100%" height="120px" borderRadius="var(--radius-xl)" />
        <div className="flex gap-4">
            <Skeleton width="100px" height="36px" />
            <Skeleton width="100px" height="36px" />
        </div>
    </div>
);
