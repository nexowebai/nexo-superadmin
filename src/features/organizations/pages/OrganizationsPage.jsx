import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button } from "@components/ui";

// Feature-specific
import OrganizationsTable from "../components/OrganizationsTable";
import { useOrganizationsPage } from "../hooks/useOrganizationsPage";

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const {
    loading,
    organizations,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    tier,
    setTier,
    dateRange,
    handleAction,
    refetch,
  } = useOrganizationsPage();

  useEffect(() => {
    setHeaderProps({
      title: "Organization",
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
    <PageContainer className="pb-12">
      <OrganizationsTable
        data={organizations}
        loading={loading}
        refetch={refetch}
        page={page}
        pagination={pagination}
        onPageChange={setPage}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        tier={tier}
        setTier={setTier}
        dateRange={dateRange}
        handleAction={handleAction}
      />
    </PageContainer>
  );
}
