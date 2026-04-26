import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function PieChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 w-full">
      <div className="relative w-44 h-44 flex items-center justify-center overflow-visible">
        <svg
          viewBox="-5 -5 110 110"
          className="w-full h-full transform -rotate-90 overflow-visible"
        >
          {data.map((item, i) => {
            const startX = Math.cos(2 * Math.PI * accumulatedPercent);
            const startY = Math.sin(2 * Math.PI * accumulatedPercent);
            accumulatedPercent += item.value / 100;
            const endX = Math.cos(2 * Math.PI * accumulatedPercent);
            const endY = Math.sin(2 * Math.PI * accumulatedPercent);

            const largeArcFlag = item.value > 50 ? 1 : 0;
            const pathData = [
              `M 50 50`,
              `L ${50 + 50 * startX} ${50 + 50 * startY}`,
              `A 50 50 0 ${largeArcFlag} 1 ${50 + 50 * endX} ${50 + 50 * endY}`,
              `Z`,
            ].join(" ");

            return (
              <motion.path
                key={i}
                d={pathData}
                fill={item.color}
                stroke="var(--bg-surface)"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.05, opacity: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="cursor-pointer outline-none"
              />
            );
          })}
        </svg>

        {/* Dynamic Center Tooltip for Pie */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute pointer-events-none z-10"
            >
              <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 shadow-xl flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                  {data[hoveredIndex].label}
                </span>
                <span className="text-sm font-black text-white">
                  {data[hoveredIndex].value}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full px-6">
        {data.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 group cursor-default transition-opacity duration-200 ${
              hoveredIndex !== null && hoveredIndex !== i
                ? "opacity-40"
                : "opacity-100"
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }} /* allowed-inline */
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500 truncate max-w-[70px]">
                {item.label}
              </span>
              <span
                className="text-[10px] font-black text-primary"
              >
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
