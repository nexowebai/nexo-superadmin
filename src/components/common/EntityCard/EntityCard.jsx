import { memo } from 'react';
import { ActionMenu } from '@components/common';
import { cn } from '@lib/cn';
import './EntityCard.css';

const EntityCard = memo(function EntityCard({
    title,
    subtitle,
    subtitleIcon: SubtitleIcon,
    avatar,
    avatarColor,
    badge,
    details = [],
    stats = [],
    footerData = [],
    statusLabel,
    statusColor,
    actions = [],
    onClick,
    className
}) {
    const handleCardClick = (e) => {
        if (e.target.closest('.ds-action-menu') || e.target.closest('button')) return;
        onClick?.();
    };

    return (
        <div
            className={cn('ds-entity-card', className)}
            onClick={handleCardClick}
            style={{ '--card-accent': statusColor }}
        >
            <div className="ds-entity-card__header">
                <div className="ds-entity-card__identity">
                    <div className="ds-entity-card__avatar" style={{ background: avatarColor }}>
                        {typeof avatar === 'string' ? <span>{avatar}</span> : avatar}
                        {statusColor && (
                            <div
                                className="ds-entity-card__status-dot"
                                style={{ background: statusColor }}
                            />
                        )}
                    </div>
                    <div className="ds-entity-card__info">
                        <h3 className="ds-entity-card__title">{title}</h3>
                        {subtitle && (
                            <div className="ds-entity-card__subtitle">
                                {SubtitleIcon && <SubtitleIcon size={12} />}
                                <span>{subtitle}</span>
                                {badge && <div className="ds-entity-card__badge-wrapper">{badge}</div>}
                            </div>
                        )}
                    </div>
                </div>

                {actions.length > 0 && (
                    <ActionMenu
                        items={actions}
                        className="ds-entity-card__actions"
                    />
                )}
            </div>

            <div className="ds-entity-card__body">
                {details.length > 0 && (
                    <div className="ds-entity-card__details">
                        {details.map((detail, idx) => (
                            detail.text && (
                                <div key={idx} className="ds-entity-card__detail-item">
                                    <div className="detail-icon-wrapper">
                                        {detail.icon && <detail.icon size={14} />}
                                    </div>
                                    <span title={detail.text}>{detail.text}</span>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

            {stats.length > 0 && (
                <div className="ds-entity-card__stats-container">
                    <div className="ds-entity-card__stats">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="ds-entity-card__stat">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="ds-entity-card__footer">
                <div className="ds-entity-card__footer-info">
                    {footerData.map((item, idx) => (
                        <div key={idx} className="footer-item">
                            {item.icon && <item.icon size={12} />}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
                {statusLabel && (
                    <div className="ds-entity-card__status" style={{ color: statusColor }}>
                        <div className="status-indicator-dot" style={{ background: statusColor }} />
                        <span>{statusLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
});

export default EntityCard;
