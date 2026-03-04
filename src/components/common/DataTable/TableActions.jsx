import { Eye, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { cn } from '@lib/cn';
import './DataTable.css';

/**
 * Reusable Table Action Buttons Component
 * Supports two modes:
 * 1. Legacy: Individual callbacks (onView, onEdit, onDelete, onTogglePower)
 * 2. Modern: Array of action objects with { label, icon, onClick, variant, disabled }
 */
export function TableActions({
    // Legacy props
    onView,
    onEdit,
    onDelete,
    onTogglePower,
    isPowered = true,
    showView = true,
    showEdit = true,
    showDelete = true,
    showPower = false,
    viewTitle = 'View Details',
    editTitle = 'Edit',
    deleteTitle = 'Delete',
    powerTitle,
    // Modern props
    actions = [],
    className,
}) {
    const actualPowerTitle = powerTitle || (isPowered ? 'Disable' : 'Enable');

    // If using modern actions array, render action buttons directly
    if (actions.length > 0) {
        return (
            <div className={cn('dt-actions', className)}>
                {actions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={idx}
                            type="button"
                            className={cn(
                                'dt-action-btn',
                                action.variant === 'danger' && 'dt-action-danger',
                                action.variant === 'warning' && 'dt-action-warning',
                                action.variant === 'success' && 'dt-action-success',
                                action.variant === 'info' && 'dt-action-info',
                                action.variant === 'primary' && 'dt-action-primary',
                                action.variant === 'view' && 'dt-action-view',
                                action.disabled && 'dt-action-disabled'
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!action.disabled) action.onClick?.();
                            }}
                            title={action.label}
                            aria-label={action.label}
                            disabled={action.disabled}
                        >
                            {Icon && <Icon size={15} />}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Legacy mode: Individual action callbacks
    return (
        <div className={cn('dt-actions', className)}>
            {showView && onView && (
                <button
                    type="button"
                    className="dt-action-btn dt-action-view"
                    onClick={(e) => { e.stopPropagation(); onView(); }}
                    title={viewTitle}
                    aria-label={viewTitle}
                >
                    <Eye size={15} />
                </button>
            )}
            {showEdit && onEdit && (
                <button
                    type="button"
                    className="dt-action-btn dt-action-edit"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    title={editTitle}
                    aria-label={editTitle}
                >
                    <Edit2 size={15} />
                </button>
            )}
            {showPower && onTogglePower && (
                <button
                    type="button"
                    className="dt-action-btn dt-action-power"
                    onClick={(e) => { e.stopPropagation(); onTogglePower(); }}
                    title={actualPowerTitle}
                    aria-label={actualPowerTitle}
                >
                    {isPowered ? <PowerOff size={15} /> : <Power size={15} />}
                </button>
            )}
            {showDelete && onDelete && (
                <button
                    type="button"
                    className="dt-action-btn dt-action-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    title={deleteTitle}
                    aria-label={deleteTitle}
                >
                    <Trash2 size={15} />
                </button>
            )}
        </div>
    );
}

export default TableActions;
