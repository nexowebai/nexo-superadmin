import { useState, useRef, useEffect, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@lib/cn';
import './ActionMenu.css';

function ActionMenu({ items, triggerIcon: TriggerIcon = MoreVertical, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = useCallback((e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, handleClickOutside]);

    const handleItemClick = (item) => {
        if (item.disabled) return;
        setIsOpen(false);
        item.onClick?.();
    };

    return (
        <div className={cn('ds-action-menu', className)} ref={menuRef}>
            <button
                className="ds-action-menu__trigger"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <TriggerIcon size={18} />
            </button>

            {isOpen && (
                <div className="ds-action-menu__dropdown">
                    {items.map((item, idx) => (
                        item.divider ? (
                            <div key={idx} className="ds-action-menu__divider" />
                        ) : (
                            <button
                                key={idx}
                                className={cn(
                                    'ds-action-menu__item',
                                    item.variant && `ds-action-menu__item--${item.variant}`,
                                    item.disabled && 'ds-action-menu__item--disabled'
                                )}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                                type="button"
                            >
                                {item.icon && <item.icon size={16} />}
                                <span>{item.label}</span>
                            </button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActionMenu;
