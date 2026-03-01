import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, RefreshCw, X, Info, AlertTriangle, XCircle,
  CheckCircle2, User, Building2, Clock, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { EmptyState, Select } from '@components/common';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { useLogs } from '../../hooks/';
import { formatRelativeTime } from '@utils/format';
import LogDetailModal from '../components/LogDetailModal';
import './LogsPage.css';

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
  { value: 'logout', label: 'Logout' },
  { value: 'new_account', label: 'New Account' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
];

const levelConfig = {
  info: { icon: Info, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  success: { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  warn: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  error: { icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

const LogCardSkeleton = () => (
  <div className="log-card log-card--skeleton">
    <div className="log-card__header">
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <div className="log-card__header-info">
        <Skeleton width="80px" height="20px" borderRadius="4px" />
        <Skeleton width="100px" height="12px" style={{ marginTop: 4 }} />
      </div>
    </div>
    <div className="log-card__body">
      <Skeleton width="100%" height="14px" />
      <Skeleton width="80%" height="14px" style={{ marginTop: 6 }} />
    </div>
    <div className="log-card__meta">
      <Skeleton width="120px" height="12px" />
      <Skeleton width="100px" height="12px" />
    </div>
  </div>
);

const LogCard = ({ log, onClick }) => {
  const config = levelConfig[log.log_level] || levelConfig.info;
  const IconComponent = config.icon;

  return (
    <motion.div
      className="log-card"
      onClick={() => onClick(log)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="log-card__header">
        <div className="log-card__icon" style={{ background: config.bg }}>
          <IconComponent size={20} style={{ color: config.color }} />
        </div>
        <div className="log-card__header-info">
          <span className="log-card__level" style={{ color: config.color }}>
            {log.log_level?.toUpperCase()}
          </span>
          <span className="log-card__type">{log.log_type || log.action || 'System'}</span>
        </div>
      </div>

      <p className="log-card__message">{log.message}</p>

      <div className="log-card__meta">
        <div className="log-card__meta-item">
          <User size={12} />
          <span>{log.email || 'System'}</span>
        </div>
        <div className="log-card__meta-item">
          <Clock size={12} />
          <span>{formatRelativeTime(log.created_at)}</span>
        </div>
      </div>

      {log.organization_name && log.organization_name !== 'System' && (
        <div className="log-card__org">
          <Building2 size={12} />
          <span>{log.organization_name}</span>
        </div>
      )}
    </motion.div>
  );
};

function LogsPage() {
  const { setHeaderProps } = useLayout();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [level, setLevel] = useState('');
  const [logType, setLogType] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { data, isLoading, refetch } = useLogs({
    page,
    limit: 12,
    search: search || undefined,
    log_level: level || undefined,
    log_type: logType || undefined,
  });

  useEffect(() => {
    setHeaderProps({
      title: "System Logs",
      action: (
        <Button variant="secondary" icon={RefreshCw} onClick={refetch} loading={isLoading}>
          Refresh
        </Button>
      )
    });
  }, [setHeaderProps, isLoading, refetch]);

  const { logs = [], pagination = { page: 1, limit: 12, total: 0, pages: 1 } } = data || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    setPage(1);
  }, []);

  return (
    <PageContainer>
      <div className="logs-toolbar">
        <form className="logs-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button type="button" className="search-clear" onClick={clearSearch}>
              <X size={16} />
            </button>
          )}
        </form>
        <div className="logs-filters">
          <Select
            options={LEVEL_OPTIONS}
            value={level}
            onChange={handleFilterChange(setLevel)}
            placeholder="Level"
          />
          <Select
            options={TYPE_OPTIONS}
            value={logType}
            onChange={handleFilterChange(setLogType)}
            placeholder="Type"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="logs-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <LogCardSkeleton key={i} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No logs found"
          description={search || level || logType ? 'Try adjusting your filters' : 'No system logs recorded yet'}
        />
      ) : (
        <div className="logs-grid">
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <LogCard key={log.id} log={log} onClick={setSelectedLog} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="logs-pagination">
          <span className="pagination-info">
            Page {page} of {pagination.pages} ({pagination.total} logs)
          </span>
          <div className="pagination-btns">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button disabled={page === pagination.pages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <LogDetailModal log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
    </PageContainer>
  );
}

export default LogsPage;
