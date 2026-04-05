import { motion } from "framer-motion";

export const MainDashboardCard = () => (
  <motion.g
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
  >
    <rect
      x="20"
      y="40"
      width="220"
      height="180"
      rx="20"
      fill="url(#cardGrad)"
    />
    <rect
      x="20"
      y="40"
      width="220"
      height="180"
      rx="20"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
      fill="none"
    />
    <rect
      x="40"
      y="65"
      width="100"
      height="12"
      rx="6"
      fill="rgba(255,255,255,0.6)"
    />
    <rect
      x="40"
      y="85"
      width="60"
      height="8"
      rx="4"
      fill="rgba(255,255,255,0.3)"
    />
    <motion.path
      d="M50 180 L85 155 L120 165 L155 130 L190 145 L220 110"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      filter="url(#glow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    />
    <motion.circle
      cx="220"
      cy="110"
      r="6"
      fill="#22c55e"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 1.8 }}
    />
  </motion.g>
);

export const StatsCard = () => (
  <motion.g
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.25 }}
  >
    <rect
      x="260"
      y="20"
      width="220"
      height="140"
      rx="20"
      fill="url(#cardGrad)"
    />
    <rect
      x="260"
      y="20"
      width="220"
      height="140"
      rx="20"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
      fill="none"
    />
    <motion.circle
      cx="330"
      cy="75"
      r="28"
      fill="url(#accentGrad)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
    />
    <motion.path
      d="M318 75 L326 83 L344 65"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
    />
    <rect
      x="370"
      y="60"
      width="90"
      height="12"
      rx="6"
      fill="rgba(255,255,255,0.5)"
    />
    <rect
      x="370"
      y="80"
      width="60"
      height="8"
      rx="4"
      fill="rgba(255,255,255,0.25)"
    />
    <rect
      x="285"
      y="120"
      width="170"
      height="8"
      rx="4"
      fill="rgba(255,255,255,0.15)"
    />
    <motion.rect
      x="285"
      y="120"
      width="0"
      height="8"
      rx="4"
      fill="#22c55e"
      animate={{ width: 120 }}
      transition={{ duration: 1, delay: 0.8 }}
    />
  </motion.g>
);
