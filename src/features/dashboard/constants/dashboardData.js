import {
  Building2,
  Users,
  FolderKanban,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  BarChart3,
  Activity,
  Server,
  Key,
} from "lucide-react";

export const STATS_CONFIG = [
  {
    key: "total_organizations",
    icon: Building2,
    iconColor: "primary",
    title: "Organizations",
  },
  {
    key: "active_licenses",
    icon: Key,
    iconColor: "info",
    title: "Active Licenses",
  },
  {
    key: "avg_latency",
    icon: Activity,
    iconColor: "warning",
    title: "Avg Latency",
  },
  {
    key: "system_health",
    icon: Server,
    iconColor: "success",
    title: "System Uptime",
    isPercent: true,
  },
];

export const MOCK_ORGANIZATIONS = [
  {
    id: 1,
    name: "Nexo Global Solutions",
    plan: "Enterprise",
    status: "active",
    userCount: 124,
    projectCount: 45,
    storageUsage: 78,
    logo: null,
  },
  {
    id: 2,
    name: "Stark Industries",
    plan: "Pro",
    status: "active",
    userCount: 86,
    projectCount: 12,
    storageUsage: 42,
    logo: null,
  },
  {
    id: 3,
    name: "Wayne Enterprises",
    plan: "Basic",
    status: "active",
    userCount: 24,
    projectCount: 8,
    storageUsage: 15,
    logo: null,
  },
  {
    id: 4,
    name: "Cyberdyn Systems",
    plan: "Pro",
    status: "warning",
    userCount: 210,
    projectCount: 64,
    storageUsage: 92,
    logo: null,
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Update Successful",
    subtitle: "System update applied to 14 nodes",
    time: "2m",
    status: "unread",
    type: "success",
  },
  {
    id: 2,
    title: "Security Alert",
    subtitle: "Login attempt from new location",
    time: "15m",
    status: "unread",
    type: "warning",
  },
  {
    id: 3,
    title: "Organization Created",
    subtitle: "Hyperion Corp added successfully",
    time: "1h",
    status: "read",
    type: "primary",
  },
  {
    id: 4,
    title: "Storage Warning",
    subtitle: "Cloud storage approaching limit",
    time: "2h",
    status: "read",
    type: "error",
  },
];

export const MOCK_HEALTH_METRICS = [
  {
    label: "System Speed",
    value: "28ms",
    icon: Zap,
    color: "#10b981",
    delay: 0.1,
  },
  {
    label: "API Load",
    value: "Perfect",
    icon: Globe,
    color: "#3b82f6",
    delay: 0.2,
  },
  {
    label: "Database Sync",
    value: "94% Synced",
    icon: Database,
    color: "#8b5cf6",
    delay: 0.3,
  },
];

export const MOCK_CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
  const revenue = 15000 + Math.random() * 10000 + Math.sin(i / 2) * 5000;
  const costs = 10000 + Math.random() * 5000 + Math.cos(i / 3) * 2000;
  return { date, revenue, costs };
});
