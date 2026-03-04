import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  FileText, Search, RefreshCw, X, Info, AlertTriangle, XCircle,
  CheckCircle2, User, Building2, Clock, Calendar, Shield, Database,
  Download, Terminal
} from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import { DataTable, TableActions, Select, SearchBar, StatsCard, StatsGrid } from '@components/common';
import { Button } from '@components/ui';
import { useLogs } from '../../hooks/';
import { formatDate, formatRelativeTime } from '@utils/format';
import LogDetailModal from '../components/LogDetailModal';
import notify from '@utils/notify';
import './LogsPage.css';

const MOCK_LOGS = [
  {
    id: 'LOG-001',
    log_level: 'info',
    log_type: 'login',
    message: 'Super Admin login successful from unknown IP 192.168.1.1',
    email: 'admin@nexo.com',
    organization_name: 'System',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    ip_address: '192.168.1.1',
    user_role: 'Super Admin'
  },
  {
    id: 'LOG-002',
    log_level: 'success',
    log_type: 'update',
    message: 'Organization "Stark Industries" subscription upgraded to Enterprise',
    email: 'tony@stark.com',
    organization_name: 'Stark Industries',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    ip_address: '10.0.0.45',
    user_role: 'Org Admin'
  },
  {
    id: 'LOG-003',
    log_level: 'error',
    log_type: 'security',
    message: 'Multiple failed login attempts detected for account research@umbrella.com',
    email: 'research@umbrella.com',
    organization_name: 'Umbrella Corp',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    ip_address: '45.12.3.99',
    user_role: 'User'
  },
  {
    id: 'LOG-004',
    log_level: 'warn',
    log_type: 'database',
    message: 'Database connection latency exceeded 500ms in region us-east-1',
    email: 'system-agent',
    organization_name: 'System',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    ip_address: 'internal-net',
    user_role: 'Service Account'
  },
  {
    id: 'LOG-005',
    log_level: 'info',
    log_type: 'export',
    message: 'User exported organization report to PDF.',
    email: 'hr@wayne.com',
    organization_name: 'Wayne Enterprises',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    ip_address: '172.16.0.4',
    user_role: 'Manager'
  }
];

const MOCK_STATS = [
  { title: 'Total Events', value: '45.2K', icon: Terminal, color: 'var(--primary)' },
  { title: 'Security Alerts', value: '14', icon: Shield, color: 'var(--error)' },
  { title: 'System Errors', value: '3', icon: XCircle, color: 'var(--warning)' },
  { title: 'Health Score', value: '98%', icon: CheckCircle2, color: 'var(--success)' },
];

const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'login', label: 'Login' },
  { value: 'security', label: 'Security' },
  { value: 'update', label: 'Update' },
  { value: 'database', label: 'Database' },
];

function LevelBadge({ level }) {
  const config = {
    info: { color: 'var(--info)', bg: 'var(--info-soft)', icon: Info },
    success: { color: 'var(--success)', bg: 'var(--success-soft)', icon: CheckCircle2 },
    warn: { color: 'var(--warning)', bg: 'var(--warning-soft)', icon: AlertTriangle },
    error: { color: 'var(--error)', bg: 'var(--error-soft)', icon: XCircle },
  };
  const { color, bg, icon: Icon } = config[level] || config.info;

  return (
    <div className="log-level-badge" style={{ color, backgroundColor: bg, borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }}>
      <Icon size={12} strokeWidth={3} />
      <span>{level.toUpperCase()}</span>
    </div>
  );
}

function TypeBadge({ type }) {
  const config = {
    login: { color: 'var(--primary)', icon: User, label: 'AUTH' },
    security: { color: 'var(--error)', icon: Shield, label: 'SEC' },
    update: { color: 'var(--success)', icon: RefreshCw, label: 'UPD' },
    database: { color: 'var(--warning)', icon: Database, label: 'DB' },
    export: { color: 'var(--info)', icon: Download, label: 'EXP' },
  };
  const { color = 'var(--text-muted)', icon: Icon = Terminal, label = 'SYS' } = config[type?.toLowerCase()] || {};

  return (
    <div className="log-type-badge" style={{ color }}>
      <Icon size={12} />
      <span>{label}</span>
    </div>
  );
}

function LogsPage() {
  const { setHeaderProps } = useLayout();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [logType, setLogType] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { data: realData, isLoading, refetch } = useLogs({
    page,
    limit,
    search: search || undefined,
    log_level: level || undefined,
    log_type: logType || undefined,
  });

  useEffect(() => {
    setHeaderProps({
      title: "System Logs & Audit",
      action: null
    });
  }, [setHeaderProps]);

  const logs = realData?.logs?.length > 0 ? realData.logs : MOCK_LOGS;
  const pagination = realData?.pagination || { page: 1, limit: 15, total: 5, pages: 1 };

  const columns = useMemo(() => [
    {
      key: 'log_level',
      label: 'Level',
      width: 120,
      render: (val) => <LevelBadge level={val} />
    },
    {
      key: 'log_type',
      label: 'Category',
      width: 130,
      render: (val) => <TypeBadge type={val} />
    },
    {
      key: 'email',
      label: 'Initiator',
      width: 200,
      render: (val) => (
        <div className="flex items-center gap-2 text-primary font-bold">
          <User size={12} className="text-muted" />
          <span className="truncate">{val || 'System'}</span>
        </div>
      )
    },
    {
      key: 'organization_name',
      label: 'Context',
      width: 180,
      render: (val) => (
        <div className="flex items-center gap-2 text-secondary font-medium">
          <Building2 size={12} className="text-muted" />
          <span className="truncate">{val || 'System'}</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      width: 120,
      render: (_, row) => (
        <div className="flex items-center gap-1.5 text-secondary font-medium">
          <Calendar size={12} className="text-muted" />
          <span>{new Date(row.created_at).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'time',
      label: 'Time',
      width: 100,
      render: (_, row) => (
        <div className="flex items-center gap-1.5 text-muted font-mono text-xs">
          <Clock size={12} />
          <span>{new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    },
    {
      key: 'message',
      label: 'Summary',
      minWidth: 350,
      render: (val) => (
        <span className="log-msg-cell truncate block">{val}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 100,
      align: 'right',
      render: (_, row) => (
        <TableActions
          actions={[
            {
              label: 'Audit Details',
              icon: Terminal,
              variant: 'info',
              onClick: () => setSelectedLog(row)
            }
          ]}
        />
      )
    }
  ], []);

  return (
    <PageContainer>
      <StatsGrid className="mb-8">
        {MOCK_STATS.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </StatsGrid>

      <DataTable
        columns={columns}
        data={logs}
        loading={isLoading}
        pagination={pagination}
        page={page}
        onPageChange={(p, l) => { setPage(p); setLimit(l); }}
        emptyIcon={FileText}
        emptyTitle="No activity logs found"
        emptyDescription="System events will appear here as they occur"
        showToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        onExportCSV={() => notify.info('Export started')}
        filters={
          <>
            <Select
              options={LEVEL_OPTIONS}
              value={level}
              onChange={(v) => { setLevel(v); setPage(1); }}
              placeholder="LogLevel"
            />
            <Select
              options={TYPE_OPTIONS}
              value={logType}
              onChange={(v) => { setLogType(v); setPage(1); }}
              placeholder="Category"
            />
          </>
        }
      />

      <LogDetailModal log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
    </PageContainer>
  );
}

export default LogsPage;
