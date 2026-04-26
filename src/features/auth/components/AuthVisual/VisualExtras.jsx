import { motion } from "framer-motion";

export const BarChartCard = () => (
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
      stroke="var(--border-base)"
      strokeWidth="1.5"
      fill="none"
    />
    <rect
      x="285"
      y="200"
      width="80"
      height="10"
      rx="5"
      fill="var(--text-muted)"
      fillOpacity="0.4"
    />
    {[
      { x: 295, h: 40, y: 240, d: 0.9 },
      { x: 330, h: 60, y: 220, d: 1.0 },
      { x: 365, h: 50, y: 230, d: 1.1 },
      { x: 400, h: 75, y: 205, d: 1.2 },
      { x: 435, h: 55, y: 225, d: 1.3 },
    ].map((bar, i) => (
      <motion.rect
        key={i}
        x={bar.x}
        width={24}
        rx={4}
        fill="url(#chartGrad)"
        initial={{ height: 0, y: 280 }}
        animate={{ height: bar.h, y: bar.y }}
        transition={{ duration: 0.5, delay: bar.d }}
      />
    ))}
  </motion.g>
);

export const TeamAvatarsCard = () => (
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
      stroke="var(--border-base)"
      strokeWidth="1.5"
      fill="none"
    />
    <motion.circle
      cx="65"
      cy="290"
      r="22"
      fill="var(--primary)"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
    />
    <motion.circle
      cx="105"
      cy="290"
      r="22"
      fill="var(--info)"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
    />
    <motion.circle
      cx="145"
      cy="290"
      r="22"
      fill="var(--primary-hover)"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
    />
    <rect
      x="175"
      y="273"
      width="45"
      height="34"
      rx="12"
      fill="var(--bg-elevated)"
    />
    <text
      x="197"
      y="296"
      textAnchor="middle"
      fill="var(--text-primary)"
      fontSize="14"
      fontWeight="700"
    >
      +8
    </text>
  </motion.g>
);

export const FloatingBackgroundElements = () => (
  <>
    <motion.circle
      cx="15"
      cy="150"
      r="6"
      fill="var(--text-muted)"
      fillOpacity="0.2"
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.circle
      cx="490"
      cy="100"
      r="4"
      fill="var(--text-muted)"
      fillOpacity="0.15"
      initial={{ y: 0 }}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
    />
    <motion.circle
      cx="250"
      cy="365"
      r="5"
      fill="var(--text-muted)"
      fillOpacity="0.1"
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
    />
  </>
);
