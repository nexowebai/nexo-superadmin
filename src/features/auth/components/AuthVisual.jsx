import { MainDashboardCard, StatsCard } from "./AuthVisual/DashboardCards";
import {
  BarChartCard,
  TeamAvatarsCard,
  FloatingBackgroundElements,
} from "./AuthVisual/VisualExtras";

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

      <MainDashboardCard />
      <StatsCard />
      <BarChartCard />
      <TeamAvatarsCard />
      <FloatingBackgroundElements />
    </svg>
  );
}

export default AuthVisual;
