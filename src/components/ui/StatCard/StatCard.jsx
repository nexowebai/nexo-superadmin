import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@lib/cn';
import './StatCard.css';

function StatCard({
    title,
    value,
    change,
    changeType = 'percentage',
    icon: Icon,
    iconColor = 'primary',
    trend,
    loading = false,
    className,
    onClick,
}) {
    const formatChange = () => {
        if (change === undefined || change === null) return null;
        const prefix = change > 0 ? '+' : '';
        const suffix = changeType === 'percentage' ? '%' : '';
        return `${prefix}${change}${suffix}`;
    };

    if (loading) {
        return (
            <div className={cn('stat-card', 'stat-card--loading', className)}>
                <div className="stat-card__skeleton-icon" />
                <div className="stat-card__skeleton-content">
                    <div className="stat-card__skeleton-title" />
                    <div className="stat-card__skeleton-value" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn('stat-card', onClick && 'stat-card--clickable', className)}
            onClick={onClick}
        >
            <div className="stat-card__main">
                {Icon && (
                    <div className={cn('stat-card__icon', `stat-card__icon--${iconColor}`)}>
                        <Icon size={22} />
                    </div>
                )}
                <div className="stat-card__content">
                    <p className="stat-card__title">{title}</p>
                    <h3 className="stat-card__value">{value}</h3>
                </div>
            </div>

            {(trend || change !== undefined) && (
                <div className={cn('stat-card__footer', trend && `stat-card__footer--${trend}`)}>
                    {trend && (
                        <span className="stat-card__trend-icon">
                            {trend === 'up' && <TrendingUp size={14} />}
                            {trend === 'down' && <TrendingDown size={14} />}
                            {trend === 'neutral' && <Minus size={14} />}
                        </span>
                    )}
                    {change !== undefined && <span className="stat-card__change-value">{formatChange()}</span>}
                    <span className="stat-card__period">vs last period</span>
                </div>
            )}
        </div>
    );
}

export default StatCard;
