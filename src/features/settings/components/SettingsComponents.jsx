

import { Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@lib/cn';
import { Switch } from '@components/ui';

export const TabWrapper = ({ children }) => (
    <div className="settings-tab-wrapper">
        {children}
    </div>
);

export const ConfigCard = ({ icon: Icon, title, desc, children, variant = 'primary' }) => (
    <div className="premium-card">
        <div className="premium-card__header">
            <div className={cn("premium-card__icon", variant)}>
                <Icon size={24} />
            </div>
            <div className="premium-card__header-content">
                <h3 className="premium-card__title">{title}</h3>
                <p className="premium-card__desc">{desc}</p>
            </div>
        </div>
        <div className="premium-card__body">{children}</div>
    </div>
);

export const Label = ({ text }) => (
    <span className="premium-label-nx">{text}</span>
);

export const InputGroup = ({ label, hint, ...props }) => (
    <div className="input-group">
        <Label text={label} />
        <input className="premium-input-nx" {...props} />
        {hint && <p className="input-hint">{hint}</p>}
    </div>
);

export const ToggleRow = ({ title, desc, checked, onChange }) => (
    <div className="toggle-row">
        <div className="toggle-row__content">
            <span className="toggle-row__title">{title}</span>
            <span className="toggle-row__desc">{desc}</span>
        </div>
        <Switch checked={checked} onChange={onChange} />
    </div>
);

export const ThemeChoice = ({ mode, current, onSelect, icon: Icon, label }) => (
    <button
        type="button"
        onClick={() => onSelect(mode)}
        className={cn(
            "theme-choice-btn-nx",
            current === mode && "active"
        )}
    >
        <div className={cn(
            "theme-choice-preview",
            mode === 'light' ? "light-preview" : "dark-preview"
        )} />
        <div className="theme-choice-footer">
            <div className="theme-choice-label-group">
                <Icon size={16} className={current === mode ? 'text-primary' : 'text-muted'} />
                <span className="theme-choice-name">
                    {label}
                </span>
            </div>
            {current === mode && <Check size={14} className="text-primary" strokeWidth={3} />}
        </div>
    </button>
);

export const PaletteCard = ({ theme, active }) => (
    <div className={cn("palette-card", active && "active")}>
        <div className="palette-colors">
            {theme.colors.map((c, i) => (
                <div 
                    key={i} 
                    className="palette-color" 
                    style={{ background: c }} 
                />
            ))}
        </div>
        <div className="palette-footer">
            {theme.name}
            {active && <CheckCircle2 size={12} className="text-primary" />}
        </div>
    </div>
);
