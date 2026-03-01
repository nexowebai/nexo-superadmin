import { cn } from '@lib/cn';
import './Tabs.css';

function Tabs({ options, value, onChange, className }) {
    return (
        <div className={cn('ds-tabs', className)}>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn('ds-tab', value === option.value && 'active')}
                    type="button"
                >
                    <span className="ds-tab-label">
                        {option.icon && <option.icon size={16} className="ds-tab-icon" />}
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

export default Tabs;
