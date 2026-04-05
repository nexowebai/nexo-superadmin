import { useEffect } from "react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { StatsCard, StatsGrid } from "@components/common";

// Feature-specific
import RequestsTable from "../components/RequestsTable";
import { useRequestsPage } from "../hooks/useRequestsPage";
import { MOCK_STATS } from "../constants/requestData";

export default function RequestsPage() {
  const { setHeaderProps } = useLayout();
  const {
    loading,
    requests,
    pagination,
    page,
    setPage,
    status,
    setStatus,
    search,
    setSearch,
    handleApprove,
    handleReject,
    refetch,
  } = useRequestsPage();

  useEffect(() => {
    setHeaderProps({
      title: "Organization Requests",
      action: null,
    });
  }, [setHeaderProps]);

  return (
    <PageContainer className="pb-12">
      <StatsGrid className="mb-8">
        {MOCK_STATS.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </StatsGrid>

      <RequestsTable
        data={requests}
        loading={loading}
        refetch={refetch}
        page={page}
        pagination={pagination}
        onPageChange={(p, l) => setPage(p)}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </PageContainer>
  );
}
