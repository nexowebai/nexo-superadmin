import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function BarChart({ data, max = 1500 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const ticks = [max, Math.round(max * 0.66), Math.round(max * 0.33), 0];

  return (
    <div className="flex w-full h-72 gap-8 items-end pb-2 pt-10">
      {/* Y-Axis Labels */}
      <div className="flex flex-col justify-between h-full pt-1 pb-10 pr-6 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {ticks.map((t) => (
          <span
            key={t}
            className="text-xs font-bold text-slate-400 tabular-nums"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex-1 flex items-end justify-between gap-6 h-full relative">
        {/* Institutional Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-10 pt-1 pointer-events-none">
          {ticks.map((t) => (
            <div
              key={t}
              className="w-full h-[1px]"
              style={{ backgroundColor: "var(--border-base)", opacity: 0.8 }}
            />
          ))}
        </div>

        {data.map((item, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-4 h-full justify-end group z-10"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full flex flex-col items-center justify-end h-full cursor-pointer">
              {/* Tooltip implementation - Locked to Bar Top */}
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 3, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 3, scale: 0.98 }}
                    className="absolute bottom-full mb-1 z-50 pointer-events-none"
                  >
                    <div className="px-2.5 py-1 rounded bg-slate-900 dark:bg-slate-800 text-white shadow-lg border border-white/10 flex flex-col items-center min-w-[60px]">
                      <span className="text-[10px] font-black text-white">
                        {item.value}
                      </span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-slate-900 dark:border-t-slate-800" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / max) * 100}%` }}
                className={`w-full max-w-[48px] rounded-t-sm transition-colors duration-200 ${
                  hoveredIndex === i ? "brightness-110" : ""
                }`}
                style={{
                  backgroundColor: "var(--primary-soft)",
                  border: "1px solid var(--primary)",
                  borderWidth: "2px 2px 0 2px",
                }}
              />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider transition-colors h-6 truncate max-w-full ${
                hoveredIndex === i
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
