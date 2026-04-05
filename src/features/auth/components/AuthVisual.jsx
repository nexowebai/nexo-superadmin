import { motion } from "framer-motion";

/* Premium Dashboard SVG Illustration */
export function AuthVisual() {
  return (
    <svg
      viewBox="0 0 500 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ds-auth__svg"
    >
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="chartGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
          <stop offset="100%" stopColor="rgba(34, 197, 94, 0.4)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Card 1 - Main Dashboard Card */}
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

        {/* Header */}
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

        {/* Line Chart */}
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

      {/* Card 2 - Stats Card (Top Right) */}
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

        {/* Success Badge */}
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

        {/* Stats Text */}
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

        {/* Progress bar */}
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

      {/* Card 3 - Bar Chart Card (Bottom Right) */}
      <motion.g
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <rect
          x="260"
          y="180"
          width="220"
          height="160"
          rx="20"
          fill="url(#cardGrad)"
        />
        <rect
          x="260"
          y="180"
          width="220"
          height="160"
          rx="20"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          fill="none"
        />

        {/* Header */}
        <rect
          x="285"
          y="200"
          width="80"
          height="10"
          rx="5"
          fill="rgba(255,255,255,0.5)"
        />

        {/* Bar Chart */}
        <motion.rect
          x="295"
          y="280"
          width="24"
          height="0"
          rx="4"
          fill="url(#chartGrad)"
          animate={{ height: 40, y: 240 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.rect
          x="330"
          y="280"
          width="24"
          height="0"
          rx="4"
          fill="url(#chartGrad)"
          animate={{ height: 60, y: 220 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />
        <motion.rect
          x="365"
          y="280"
          width="24"
          height="0"
          rx="4"
          fill="url(#chartGrad)"
          animate={{ height: 50, y: 230 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.rect
          x="400"
          y="280"
          width="24"
          height="0"
          rx="4"
          fill="url(#chartGrad)"
          animate={{ height: 75, y: 205 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        <motion.rect
          x="435"
          y="280"
          width="24"
          height="0"
          rx="4"
          fill="url(#chartGrad)"
          animate={{ height: 55, y: 225 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        />

        {/* Mini Stats */}
        <rect
          x="285"
          y="300"
          width="50"
          height="20"
          rx="6"
          fill="rgba(255,255,255,0.1)"
        />
        <rect
          x="345"
          y="300"
          width="50"
          height="20"
          rx="6"
          fill="rgba(255,255,255,0.1)"
        />
      </motion.g>

      {/* Card 4 - Team Avatars (Bottom Left) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <rect
          x="20"
          y="240"
          width="220"
          height="100"
          rx="20"
          fill="url(#cardGrad)"
        />
        <rect
          x="20"
          y="240"
          width="220"
          height="100"
          rx="20"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          fill="none"
        />

        {/* Avatars */}
        <motion.circle
          cx="65"
          cy="290"
          r="22"
          fill="#22c55e"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.circle
          cx="105"
          cy="290"
          r="22"
          fill="#16a34a"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="145"
          cy="290"
          r="22"
          fill="#15803d"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />

        {/* +N Badge */}
        <rect
          x="175"
          y="273"
          width="45"
          height="34"
          rx="12"
          fill="rgba(255,255,255,0.2)"
        />
        <text
          x="197"
          y="296"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="700"
        >
          +8
        </text>
      </motion.g>

      {/* Floating Decorative Elements */}
      <motion.circle
        cx="15"
        cy="150"
        r="6"
        fill="rgba(255,255,255,0.3)"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="490"
        cy="100"
        r="4"
        fill="rgba(255,255,255,0.25)"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="250"
        cy="365"
        r="5"
        fill="rgba(255,255,255,0.2)"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </svg>
  );
}

export default AuthVisual;
