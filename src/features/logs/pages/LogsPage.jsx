import { useEffect } from "react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { StatsCard, StatsGrid } from "@components/common";

// Feature-specific
import { useLogsPage } from "../hooks/useLogsPage";
import { LogsTable } from "../components/LogsTable";
import LogDetailModal from "../components/LogDetailModal";

import "./LogsPage.css";

import { DateRangePicker } from "@components/ui";

function LogsPage() {
  const { setHeaderProps } = useLayout();
  const {
    isLoading,
    isFetching,
    logs,
    pagination,
    page,
    setPage,
    setLimit,
    search,
    setSearch,
    level,
    setLevel,
    logType,
    setLogType,
    dateRange,
    setDateRange,
    selectedLog,
    setSelectedLog,
    refetch,
    stats,
  } = useLogsPage();

  useEffect(() => {
    setHeaderProps({
      title: "Audit Logs",
      action: null,
    });

    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps]);

  return (
    <PageContainer className="logs-v2 pb-12">
      {/* 1. Operational Toolbar - Simplified Language & Larger Typography */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Activity Overview</h2>
          <p className="text-base text-slate-600 font-medium mt-1">Monitor recent system activity and audit logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-[300px]"
          />
        </div>
      </div>

      {/* 2. Operational Telemetry */}
      <StatsGrid className="mb-10">
        {isLoading && stats.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
            <StatsCard key={`sk-${i}`} loading={true} />
          ))
          : stats.map((stat, i) => (
            <StatsCard key={i} {...stat} loading={false} />
          ))}
      </StatsGrid>

      {/* 3. Transactional Audit Layer */}
      <LogsTable
        data={logs}
        loading={isFetching}
        pagination={pagination}
        page={page}
        onPageChange={(p, l) => {
          setPage(p);
          setLimit(l);
        }}
        search={search}
        onSearchChange={setSearch}
        level={level}
        setLevel={setLevel}
        logType={logType}
        setLogType={setLogType}
        onRefresh={refetch}
        onViewDetail={setSelectedLog}
      />

      {/* 4. Audit Inspector */}
      <LogDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </PageContainer>
  );
}

export default LogsPage;
