import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialLimit = 20) {
    const [pagination, setPagination] = useState({
        page: initialPage,
        limit: initialLimit,
        total: 0,
        pages: 0,
    });

    const setPage = useCallback((page) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    const setLimit = useCallback((limit) => {
        setPagination(prev => ({ ...prev, limit, page: 1 }));
    }, []);

    const setTotal = useCallback((total) => {
        setPagination(prev => ({
            ...prev,
            total,
            pages: Math.ceil(total / prev.limit),
        }));
    }, []);

    const nextPage = useCallback(() => {
        setPagination(prev => ({
            ...prev,
            page: Math.min(prev.page + 1, prev.pages),
        }));
    }, []);

    const prevPage = useCallback(() => {
        setPagination(prev => ({
            ...prev,
            page: Math.max(prev.page - 1, 1),
        }));
    }, []);

    const reset = useCallback(() => {
        setPagination({
            page: initialPage,
            limit: initialLimit,
            total: 0,
            pages: 0,
        });
    }, [initialPage, initialLimit]);

    return {
        ...pagination,
        setPage,
        setLimit,
        setTotal,
        nextPage,
        prevPage,
        reset,
        hasNext: pagination.page < pagination.pages,
        hasPrev: pagination.page > 1,
    };
}
