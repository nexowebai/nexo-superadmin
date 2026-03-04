import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { useLayout } from "@context";
import { useDashboardStats } from "../../hooks";
import { formatNumber } from "@utils/format";
import StatsOverview from "../components/StatsOverview";
import OrganizationGrid from "../components/OrganizationGrid";
import DistributionCharts from "../components/DistributionCharts";
import NotificationCenter from "../components/NotificationCenter";
import SystemHealth from "../components/SystemHealth";
import { Button } from "@components/ui";
import { Building2, Users, FolderKanban, ShieldCheck } from "lucide-react";
import "./DashboardPage.css";

const STATS_CONFIG = [
  { key: "total_organizations", icon: "Building2", color: "#16a34a", label: "Organizations" },
  { key: "active_users", icon: "Users", color: "#3b82f6", label: "Active Users" },
  { key: "total_projects", icon: "FolderKanban", color: "#10b981", label: "Projects" },
  { key: "system_health", icon: "ShieldCheck", color: "#f59e0b", label: "System Health", isPercent: true },
];

// Re-map icons to Lucide components for StatsCard compatibility
const ICON_MAP = {
  Building2,
  Users,
  FolderKanban,
  ShieldCheck
};

function DashboardPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const { data, isLoading: loading } = useDashboardStats();

  useEffect(() => {
    setHeaderProps({
      title: (
        <div className="dash-pro__title">
          <span>Platform Overview</span>
        </div>
      ),
      action: (
        <Button
          variant="primary"
          icon={Zap}
          onClick={() => navigate('/organizations/create')}
          className="h-[48px] px-6"
        >
          Add Organization
        </Button>
      )
    });
  }, [setHeaderProps]);

  const colors = useMemo(() => ({
    primary: "#16a34a", // Nexo Green
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    grid: "rgba(0,0,0,0.03)",
    text: "#71717a",
  }), []);

  const metrics = useMemo(() => {
    const summary = data?.summary || [];
    return STATS_CONFIG.map((config, index) => {
      const stat = summary.find(s => s.key === config.key);
      const value = stat?.value ?? 0;
      return {
        ...config,
        icon: ICON_MAP[config.icon],
        value: config.isPercent ? `${value}%` : formatNumber(value),
        trend: config.key !== "system_health" ? Math.floor(Math.random() * 30) - 10 : undefined,
        delay: index * 0.05,
      };
    });
  }, [data]);

  const pieData = useMemo(() => {
    const raw = data?.charts?.organization_status || [];
    const colorMap = { active: colors.success, disabled: colors.error, pending: colors.warning };
    return raw.map(item => ({ ...item, color: colorMap[item.name] || colors.info }));
  }, [data, colors]);

  const barData = useMemo(() => {
    return (data?.charts?.plan_distribution || []).map(item => ({
      ...item,
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    }));
  }, [data]);

  const notifications = useMemo(() => data?.recent_notifications || [], [data]);
  const systemHealth = useMemo(() => {
    const stat = (data?.summary || []).find(s => s.key === "system_health");
    return stat?.value || 99.9;
  }, [data]);

  const organizations = useMemo(() => [
    { id: 1, name: "Nexo Global Solutions", plan: "Enterprise", status: "active", userCount: 124, projectCount: 45, storageUsage: 78, logo: null },
    { id: 2, name: "Stark Industries", plan: "Pro", status: "active", userCount: 86, projectCount: 12, storageUsage: 42, logo: null },
    { id: 3, name: "Wayne Enterprises", plan: "Basic", status: "active", userCount: 24, projectCount: 8, storageUsage: 15, logo: null },
    { id: 4, name: "Cyberdyn Systems", plan: "Pro", status: "warning", userCount: 210, projectCount: 64, storageUsage: 92, logo: null },
    { id: 5, name: "OsCorp", plan: "Enterprise", status: "active", userCount: 156, projectCount: 38, storageUsage: 65, logo: null },
    { id: 6, name: "Umbrella Corp", plan: "Basic", status: "error", userCount: 12, projectCount: 2, storageUsage: 5, logo: null },
  ], []);

  const slaMetrics = useMemo(() => ({
    onTime: 87,
    delayed: 8,
    critical: 5,
    avgResponseTime: "2.4h"
  }), []);

  return (
    <PageContainer className="dash-pro">
      <StatsOverview loading={loading} metrics={metrics} />

      <OrganizationGrid
        loading={loading}
        organizations={organizations}
        onOrgClick={(id) => navigate(`/organizations/${id}`)}
      />

      <div className="grid-pro">
        <div className="grid-pro__main">
          <DistributionCharts
            loading={loading}
            barData={barData}
            pieData={pieData}
            colors={colors}
            isDark={false}
            onlyBar={true}
          />

          <NotificationCenter
            loading={loading}
            notifications={notifications}
            onViewAll={() => navigate("/notifications")}
          />
        </div>

        <div className="grid-pro__side">
          <DistributionCharts
            loading={loading}
            barData={barData}
            pieData={pieData}
            colors={colors}
            isDark={false}
            onlyPie={true}
          />
          <SystemHealth loading={loading} systemHealth={systemHealth} />
        </div>
      </div>
    </PageContainer>
  );
}

export default DashboardPage;

