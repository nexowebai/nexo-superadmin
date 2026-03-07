import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  FolderKanban,
  ShieldCheck,
  Plus,
  Activity,
  Bell
} from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { useLayout } from "@context";
import { useDashboardStats } from "../../hooks";
import { formatNumber } from "@utils/format";
import { Button } from "@components/ui";

// Components
import { StatsCard, StatsGrid } from "@components/common/StatsCard/StatsCard";
import OrganizationGrid from "../components/OrganizationGrid";
import FinancialPerformance from "../components/FinancialPerformance";
import SystemHealth from "../components/SystemHealth";
import NotificationCenter from "../components/NotificationCenter";

import "./DashboardPage.css";

const STATS_CONFIG = [
  { key: "total_organizations", icon: Building2, color: "var(--primary)", title: "Organizations" },
  { key: "active_users", icon: Users, color: "var(--info)", title: "Total Users" },
  { key: "total_projects", icon: FolderKanban, color: "var(--secondary)", title: "Active Projects" },
  { key: "system_health", icon: ShieldCheck, color: "var(--success)", title: "Active Uptime", isPercent: true },
];



function DashboardPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const { data, isLoading: loading } = useDashboardStats();

  useEffect(() => {
    setHeaderProps({
      title: "Super Admin Control Center",
      action: (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="w-11 h-11 rounded-md border border-base bg-surface-subtle hover:bg-surface-elevated transition-all"
          >
            <Bell className="w-5 h-5 text-muted" />
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/organizations/create')}
            className="h-11 px-5 rounded-md font-bold text-[11px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary border-none shadow-sm shadow-emerald-500/10 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </Button>
        </div>
      )
    });
  }, [setHeaderProps, navigate]);



  const metrics = useMemo(() => {
    const summary = data?.summary || [];
    return STATS_CONFIG.map((config, index) => {
      const stat = summary.find(s => s.key === config.key);
      const value = stat?.value ?? 0;
      return {
        ...config,
        value: config.isPercent ? `${value}%` : formatNumber(value),
        trend: config.key !== "system_health" ? Math.floor(Math.random() * 30) - 10 : undefined,
        delay: index * 0.05,
      };
    });
  }, [data]);

  const organizations = useMemo(() => [
    { id: 1, name: "Nexo Global Solutions", plan: "Enterprise", status: "active", userCount: 124, projectCount: 45, storageUsage: 78, logo: null },
    { id: 2, name: "Stark Industries", plan: "Pro", status: "active", userCount: 86, projectCount: 12, storageUsage: 42, logo: null },
    { id: 3, name: "Wayne Enterprises", plan: "Basic", status: "active", userCount: 24, projectCount: 8, storageUsage: 15, logo: null },
    { id: 4, name: "Cyberdyn Systems", plan: "Pro", status: "warning", userCount: 210, projectCount: 64, storageUsage: 92, logo: null },
  ], []);

  return (
    <PageContainer className="dashboard-v2 pb-12 overflow-hidden">
      {/* 1. Statistics Cards Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <StatsGrid columns={4}>
          {metrics.map((metric) => (
            <StatsCard
              key={metric.key}
              title={metric.title}
              value={metric.value}
              trend={metric.trend}
              icon={metric.icon}
              color={metric.color}
              loading={loading}
            />
          ))}
        </StatsGrid>
      </motion.section>


      {/* 2. Primary Layout: Analysis & Insights */}
      <div className="layout-grid-nx">
        {/* Main Column (2/3) */}
        <div className="main-column-nx">
          <div className="section-stack-nx">
            <FinancialPerformance loading={loading} />
            <OrganizationGrid
              loading={loading}
              organizations={organizations}
              onOrgClick={(id) => navigate(`/organizations/${id}`)}
            />
          </div>
        </div>

        {/* Sidebar Column (1/3) */}
        <aside className="sidebar-column-nx">
          <div className="sidebar-stack-nx">
            <SystemHealth loading={loading} />
            <NotificationCenter loading={loading} />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

export default DashboardPage;
