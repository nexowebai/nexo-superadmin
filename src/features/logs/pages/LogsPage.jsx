import { useEffect } from 'react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import { StatsCard, StatsGrid } from '@components/common';

// Feature-specific
import { useLogsPage } from '../hooks/useLogsPage';
import { LogsTable } from '../components/LogsTable';
import LogDetailModal from '../components/LogDetailModal';

import './LogsPage.css';

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
    selectedLog,
    setSelectedLog,
    refetch,
    stats
  } = useLogsPage();

  useEffect(() => {
    setHeaderProps({
      title: "System Logs & Audit",
      action: null
    });
  }, [setHeaderProps]);

  return (
    <PageContainer className="logs-v2 pb-12">
      {/* 1. Operational Telemetry */}
      <StatsGrid className="mb-8">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} loading={isLoading} />
        ))}
      </StatsGrid>

      {/* 2. Transactional Audit Layer */}
      <LogsTable
        data={logs}
        loading={isFetching}
        pagination={pagination}
        page={page}
        onPageChange={(p, l) => { setPage(p); setLimit(l); }}
        search={search}
        onSearchChange={setSearch}
        level={level}
        setLevel={setLevel}
        logType={logType}
        setLogType={setLogType}
        onRefresh={refetch}
        onViewDetail={setSelectedLog}
      />

      {/* 3. Audit Inspector */}
      <LogDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </PageContainer>
  );
}

export default LogsPage;
