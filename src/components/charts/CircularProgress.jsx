import { motion } from "framer-motion";

export default function CircularProgress({ percent, color, label }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="var(--bg-elevated)"
            strokeWidth="14"
            fill="transparent"
          />
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            stroke={color}
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className="text-4xl font-black tracking-tighter text-primary"
          >
            {percent}%
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
            Used
          </span>
        </div>
      </div>
      <span className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
    </div>
  );
}
