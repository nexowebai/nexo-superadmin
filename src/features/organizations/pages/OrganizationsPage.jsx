import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import Button from "@components/ui/Button";
import { DateRangePicker } from "@components/ui";
import OrganizationsTable from "../components/OrganizationsTable";
import { useOrganizations } from "../../hooks/";

function useOrganizationsMock() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrganizations([
        { id: 1, org_code: "ACM001", name: "Acme Global Solutions", subscription_tier: "Enterprise", status: "active", users_count: 124, projects_count: 45, logo: null, created_at: "2024-01-15T10:00:00Z", email: "contact@acme.com" },
        { id: 2, org_code: "STRK02", name: "Stark Industries", subscription_tier: "Professional", status: "active", users_count: 86, projects_count: 12, logo: null, created_at: "2024-02-01T12:00:00Z", email: "tony@stark.com" },
        { id: 3, org_code: "WYN003", name: "Wayne Enterprises", subscription_tier: "Basic", status: "active", users_count: 24, projects_count: 8, logo: null, created_at: "2024-02-10T09:00:00Z", email: "bruce@wayne.org" },
        { id: 4, org_code: "CYB004", name: "Cyberdyne Systems", subscription_tier: "Professional", status: "warning", users_count: 210, projects_count: 64, logo: null, created_at: "2024-02-15T14:00:00Z", email: "skynet@cyberdyne.com" },
        { id: 5, org_code: "OSC005", name: "OsCorp", subscription_tier: "Enterprise", status: "active", users_count: 156, projects_count: 38, logo: null, created_at: "2024-02-20T11:00:00Z", email: "norman@oscorp.com" },
        { id: 6, org_code: "UMB006", name: "Umbrella Corp", subscription_tier: "Basic", status: "disabled", users_count: 12, projects_count: 2, logo: null, created_at: "2024-02-22T16:00:00Z", email: "wesker@umbrella.com" },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { organizations, loading };
}

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tier, setTier] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const { organizations, loading } = useOrganizationsMock();

  useEffect(() => {
    setHeaderProps({
      title: "Organizations",
      action: (
        <Button icon={Plus} onClick={() => navigate("/organizations/create")} variant="primary">
          Add Organization
        </Button>
      )
    });
  }, [setHeaderProps, navigate]);

  const pagination = { page, limit: 10, total: organizations.length, pages: 1 };

  const handlePageChange = useCallback((newPage) => setPage(newPage), []);

  return (
    <PageContainer>
      <OrganizationsTable
        data={organizations}
        loading={loading}
        page={page}
        pagination={pagination}
        onPageChange={handlePageChange}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        tier={tier}
        setTier={setTier}
        dateRange={dateRange}
      />
    </PageContainer>
  );
}
