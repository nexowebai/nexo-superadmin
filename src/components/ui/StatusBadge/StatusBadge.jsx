import { cn } from '@lib/cn';
import { getStatusConfig } from '@constants/status';
import './StatusBadge.css';

function StatusBadge({ status, label, size = 'sm', className }) {
    const config = getStatusConfig(status);

    return (
        <span
            className={cn(
                'ds-status-badge',
                `ds-status-badge--${size}`,
                `ds-status-badge--${config.variant}`,
                className
            )}
            style={config.strikeThrough ? { textDecoration: 'line-through' } : {}}
        >
            <span className="ds-status-badge__dot" style={{ backgroundColor: config.color }} />
            {label || config.label}
        </span>
    );
}

export default StatusBadge;
