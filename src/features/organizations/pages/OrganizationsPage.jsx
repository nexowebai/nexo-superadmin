import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LayoutGrid, List, Download, Filter } from "lucide-react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import {
  Button,
  Input,
  Select,
  OrganizationCard,
  SearchEmptyState,
} from "@components/ui";
import DateRangePicker from "@components/ui/DateRangePicker/DateRangePicker";
import { cn } from "@lib/cn";

import OrganizationsTable from "../components/OrganizationsTable";
import { useOrganizationsPage } from "../hooks/useOrganizationsPage";

const PLAN_OPTIONS = [
  { value: "", label: "All Plans" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

const VIEW_MODE_KEY = "nexo_org_view_mode";

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem(VIEW_MODE_KEY) || "table",
  );

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
    setDateRange,
    performAction,
    refetch,
  } = useOrganizationsPage();

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    setHeaderProps({
      title: "Organization Hub",
      action: (
        <div className="flex items-center gap-3">
          <Button variant="soft" icon={Download}>
            Export
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/organizations/create")}
          >
            Add Organization
          </Button>
        </div>
      ),
    });

    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, navigate]);

  const handleReset = () => {
    setSearch("");
    setTier("");
    setStatus("");
    setDateRange({ startDate: null, endDate: null });
  };

  const showEmpty = !loading && organizations.length === 0;

  // Determine if empty state is due to search or filter
  const emptyType = search
    ? "search"
    : tier || status || dateRange.startDate
      ? "filter"
      : "search";

  return (
    <PageContainer className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search by name, ID or email..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            clearable
            onClear={() => setSearch("")}
            className="search-input-nexo"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={PLAN_OPTIONS}
            value={tier}
            onChange={setTier}
            placeholder="Filter by Plan"
            className="w-48"
            icon={Filter}
          />

          <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            onChange={setDateRange}
            align="end"
            className="w-[280px]"
          />

          <div className="h-10 w-px bg-border-base mx-1 hidden md:block" />

          <div className="flex p-1 bg-subtle rounded-xl border border-base shadow-sm h-11 items-center">
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "flex items-center justify-center w-10 h-9 rounded-lg transition-all",
                viewMode === "cards"
                  ? "bg-surface text-primary shadow-sm border border-base"
                  : "text-secondary hover:text-primary",
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center justify-center w-10 h-9 rounded-lg transition-all",
                viewMode === "table"
                  ? "bg-surface text-primary shadow-sm border border-base"
                  : "text-secondary hover:text-primary",
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {showEmpty ? (
        <SearchEmptyState
          onReset={handleReset}
          searchTerm={search}
          type={emptyType}
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-subtle animate-pulse rounded-2xl border border-base"
                  />
                ))
            : organizations.map((org) => (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  onClick={() => navigate(`/organizations/${org.id}`)}
                />
              ))}
        </div>
      ) : (
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
          handleAction={performAction}
        />
      )}
    </PageContainer>
  );
}
