import { Check, CheckCircle2 } from "lucide-react";
import { cn } from "@lib/cn";
import { Switch } from "@components/ui";

export const TabWrapper = ({ children }) => (
  <div className="settings-tab-wrapper">{children}</div>
);

export const ConfigCard = ({
  icon: Icon,
  title,
  desc,
  children,
  variant = "primary",
}) => (
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

export const ThemeChoice = ({ mode, current, onSelect, label }) => (
  <button
    type="button"
    onClick={() => onSelect(mode)}
    className={cn("theme-choice-btn-nx", current === mode && "active")}
  >
    <div
      className={cn(
        "theme-choice-preview-modern",
        mode === "light" ? "light-mode-preview" : "dark-mode-preview",
      )}
    >
      <div className="preview-sidebar" />
      <div className="preview-content">
        <div className="preview-header" />
        <div className="preview-blocks">
          <div className="preview-block" />
          <div className="preview-block w-[70%]" />
        </div>
      </div>
    </div>
    <div className="theme-choice-footer-v2">
      <span className="theme-choice-name">{label}</span>
      {current === mode && <div className="selected-dot animate-in zoom-in" />}
    </div>
  </button>
);

export const PaletteCard = ({ theme, active, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect && onSelect(theme.id)}
    className={cn("palette-card-v2", active && "active")}
  >
    <div className="palette-preview-v2">
      {theme.colors.map((c, i) => (
        <div
          key={i}
          className="palette-swatch"
          style={{
            backgroundColor: c,
            zIndex: theme.colors.length - i,
          }}
        />
      ))}
    </div>
    <div className="palette-info">
      <span className="palette-name">{theme.name}</span>
    </div>
  </button>
);
