import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, OrganizationCard, SearchEmptyState } from "@components/ui";
import OrganizationsTable from "../components/table/OrganizationsTable";
import { OrgToolbar } from "../components/table/OrgToolbar";
import { useOrganizationsPage } from "../hooks/useOrganizationsPage";

const VIEW_MODE_KEY = "nexo_org_view_mode";

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_MODE_KEY) || "table");

  const {
    loading, organizations, pagination, page, setPage, search, setSearch,
    status, setStatus, tier, setTier, dateRange, setDateRange, performAction, refetch,
  } = useOrganizationsPage();

  useEffect(() => { localStorage.setItem(VIEW_MODE_KEY, viewMode); }, [viewMode]);

  useEffect(() => {
    setHeaderProps({
      title: "Organization Hub",
      action: (
        <div className="flex items-center gap-3">
          <Button variant="soft" icon={Download}>Export</Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate("/organizations/create")}>Add Organization</Button>
        </div>
      ),
    });
    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, navigate]);

  const handleReset = () => {
    setSearch(""); setTier(""); setStatus(""); setDateRange({ startDate: null, endDate: null });
  };

  const emptyType = search ? "search" : tier || status || dateRange.startDate ? "filter" : "search";

  return (
    <PageContainer className="pb-12">
      <OrgToolbar 
        search={search} setSearch={setSearch} tier={tier} setTier={setTier} 
        dateRange={dateRange} setDateRange={setDateRange} viewMode={viewMode} setViewMode={setViewMode} 
      />

      {organizations.length === 0 && !loading ? (
        <SearchEmptyState onReset={handleReset} searchTerm={search} type={emptyType} />
      ) : viewMode === "cards" ? (
        <OrgGrid loading={loading} organizations={organizations} onOrgClick={(id) => navigate(`/organizations/${id}`)} />
      ) : (
        <OrganizationsTable
          data={organizations} loading={loading} refetch={refetch} page={page}
          pagination={pagination} onPageChange={setPage} search={search} setSearch={setSearch}
          status={status} setStatus={setStatus} tier={tier} setTier={setTier} handleAction={performAction}
        />
      )}
    </PageContainer>
  );
}

function OrgGrid({ loading, organizations, onOrgClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-48 bg-subtle animate-pulse rounded-2xl border border-base" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
      {organizations.map((org) => (
        <OrganizationCard key={org.id} organization={org} onClick={() => onOrgClick(org.id)} />
      ))}
    </div>
  );
}
