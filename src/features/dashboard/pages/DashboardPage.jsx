import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { useLayout } from "@context";
import { Button } from "@components/ui";

// Feature-specific
import { StatsCard, StatsGrid } from "@components/ui";
import OrganizationGrid from "../components/OrganizationGrid";
import FinancialPerformance from "../components/FinancialPerformance";
import SystemHealth from "../components/SystemHealth";
import NotificationCenter from "../components/NotificationCenter";
import { useDashboard } from "../hooks/useDashboard";
import DashboardHero from "../components/DashboardHero";
import "../styles/dashboard.css";

function DashboardPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const { metrics, organizations, loading } = useDashboard();

  useEffect(() => {
    setHeaderProps({
      title: "Dashboard",
      action: (
        <Button
          icon={Plus}
          onClick={() => navigate("/organizations/create")}
          variant="primary"
        >
          Add Organization
        </Button>
      ),
    });
  }, [setHeaderProps, navigate]);

  return (
    <PageContainer className="dashboard-v2 pb-12 overflow-hidden">
      <DashboardHero />

      <div className="flex flex-col gap-8">
        {/* 1. Statistics Summary */}
        <section>
          <StatsGrid columns={4}>
            {loading && metrics.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <StatsCard key={`sk-${i}`} loading={true} />
                ))
              : metrics.map(({ key, ...metricData }) => (
                  <StatsCard key={key} {...metricData} loading={loading} />
                ))}
          </StatsGrid>
        </section>

        {/* 2. Analytical Intelligence Grid */}
        <div className="layout-grid-nx">
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

          <aside className="sidebar-column-nx">
            <div className="sidebar-stack-nx">
              <SystemHealth loading={loading} />
              <NotificationCenter loading={loading} />
            </div>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default DashboardPage;
