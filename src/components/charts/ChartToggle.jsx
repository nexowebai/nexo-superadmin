import React from "react";
import { LineChart as LineIcon, BarChart3 as BarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@lib/cn";

const ChartToggle = ({ value, onChange }) => {
  return (
    <div className="relative flex items-center p-1 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl overflow-hidden min-w-[200px] h-[40px]">
      {/* Animated Sliding Highlight - Updated to light primary background */}
      <motion.div
        layoutId="activeTab"
        className="absolute inset-y-1 bg-[var(--primary-soft)] border border-[var(--primary-soft)] rounded-lg z-0"
        initial={false}
        animate={{
          left: value === "line" ? "4px" : "50%",
          width: "calc(50% - 4px)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />

      <button
        onClick={() => onChange("line")}
        className={cn(
          "relative z-10 flex-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
          value === "line" ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        )}
      >
        <LineIcon size={14} />
        <span>Line</span>
      </button>

      <button
        onClick={() => onChange("bar")}
        className={cn(
          "relative z-10 flex-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
          value === "bar" ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        )}
      >
        <BarIcon size={14} />
        <span>Bar</span>
      </button>
    </div>
  );
};

export default ChartToggle;
