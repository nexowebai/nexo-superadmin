import { motion } from "framer-motion";
import { cn } from "@lib/cn";
import "./Tabs.css";

function Tabs({ options, value, onChange, className, variant }) {
  return (
    <div className={cn("ds-tabs", variant && `ds-tabs--${variant}`, className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "ds-tab",
            value === option.value && "active",
            variant && `ds-tab--${variant}`,
          )}
          type="button"
        >
          <span className="ds-tab-label">
            {option.icon && (
              <div className="ds-tab-icon-wrapper">
                <option.icon size={16} />
              </div>
            )}
            {option.label}
          </span>
          {value === option.value && (
            <motion.div
              layoutId="activeTab"
              className="ds-tab-indicator"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
