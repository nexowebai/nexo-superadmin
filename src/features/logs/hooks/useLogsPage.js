import { useState, useCallback } from 'react';
import { useLogs } from './useLogs';
import { MOCK_LOGS, MOCK_STATS } from '../constants/logData';

export function useLogsPage() {
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

    const logs = realData?.logs?.length > 0 ? realData.logs : MOCK_LOGS;
    const pagination = realData?.pagination || { page: 1, limit: 15, total: logs.length, pages: 1 };

    const handleSearch = useCallback((val) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleLevelChange = useCallback((v) => {
        setLevel(v);
        setPage(1);
    }, []);

    const handleTypeChange = useCallback((v) => {
        setLogType(v);
        setPage(1);
    }, []);

    return {
        isLoading,
        logs,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch: handleSearch,
        level,
        setLevel: handleLevelChange,
        logType,
        setLogType: handleTypeChange,
        selectedLog,
        setSelectedLog,
        refetch,
        stats: MOCK_STATS
    };
}
