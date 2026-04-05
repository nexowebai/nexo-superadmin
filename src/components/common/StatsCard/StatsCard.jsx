import { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@components/ui';
import './StatsCard.css';

const StatsCard = memo(function StatsCard({
    title,
    value,
    trend,
    icon: Icon,
    color = 'var(--primary)',
    delay = 0,
    loading = false,
}) {
    if (loading) return <StatsCardSkeleton />;

    return (
        <div className="stats-card">
            <div className="stats-header">
                <span className="stats-title">{title}</span>
                {Icon && (
                    <div className="stats-icon" style={{ backgroundColor: `color-mix(in srgb, ${color}, transparent 85%)`, color }}>
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                )}
            </div>

            <div className="stats-value">{value}</div>

            {trend !== undefined && (
                <div className={`stats-trend ${trend >= 0 ? 'up' : 'down'}`}>
                    {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{Math.abs(trend)}% vs last month</span>
                </div>
            )}
        </div>
    );
});

function StatsCardSkeleton() {
    return (
        <div className="stats-card stats-skeleton">
            <div className="stats-header">
                <Skeleton width="60%" height="14px" />
                <Skeleton variant="circle" width="40px" height="40px" className="rounded-lg" />
            </div>
            <div className="stats-value">
                <Skeleton width="45%" height="36px" />
            </div>
            <div className="stats-trend">
                <Skeleton width="55%" height="18px" />
            </div>
        </div>
    );
}

function StatsGrid({ children, columns, className = '' }) {
    const style = columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {};
    return (
        <div className={`stats-grid ${className}`} style={style}>
            {children}
        </div>
    );
}

export default StatsCard;
export { StatsCard, StatsCardSkeleton, StatsGrid };
