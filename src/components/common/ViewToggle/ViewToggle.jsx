import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@lib/cn';
import './ViewToggle.css';

function ViewToggle({ view = 'card', onChange, className }) {
    return (
        <div className={cn('ds-view-toggle', className)}>
            <button
                type="button"
                className={cn('ds-view-toggle__btn', view === 'card' && 'ds-view-toggle__btn--active')}
                onClick={() => onChange?.('card')}
            >
                <LayoutGrid size={18} />
            </button>
            <button
                type="button"
                className={cn('ds-view-toggle__btn', view === 'table' && 'ds-view-toggle__btn--active')}
                onClick={() => onChange?.('table')}
            >
                <List size={18} />
            </button>
            <div
                className="ds-view-toggle__indicator"
                style={{ transform: view === 'card' ? 'translateX(0)' : 'translateX(100%)' }}
            />
        </div>
    );
}

export default ViewToggle;
