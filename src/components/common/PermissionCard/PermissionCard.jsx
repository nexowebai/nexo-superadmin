import { cn } from '@lib/cn';
import Toggle from '@components/ui/Toggle';
import './PermissionCard.css';

function PermissionCard({ icon: Icon, title, description, checked, onChange, className }) {
    return (
        <div
            className={cn('permission-card', checked && 'permission-card--active', className)}
            onClick={() => onChange?.(!checked)}
        >
            <div className="permission-card__icon">
                <Icon size={20} />
            </div>
            <div className="permission-card__text">
                <span className="permission-card__title">{title}</span>
                {description && <span className="permission-card__desc">{description}</span>}
            </div>
            <Toggle checked={checked} onChange={onChange} size="sm" />
        </div>
    );
}

export default PermissionCard;
