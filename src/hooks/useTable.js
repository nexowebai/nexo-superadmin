import { useState, useMemo, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';

export function useDataTable({
    data = [],
    columns = [],
    pageSize = 20,
    manualPagination = true,
    manualSorting = true,
    pageCount = -1,
    onPaginationChange,
    onSortingChange,
    state = {},
}) {
    const [sorting, setSorting] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [{ pageIndex, pageSize: pSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });

    const pagination = useMemo(
        () => ({ pageIndex, pageSize: pSize }),
        [pageIndex, pSize]
    );

    const handleSortingChange = useCallback(
        (updater) => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(newSorting);
            onSortingChange?.(newSorting);
        },
        [sorting, onSortingChange]
    );

    const handlePaginationChange = useCallback(
        (updater) => {
            const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
            setPagination(newPagination);
            onPaginationChange?.(newPagination);
        },
        [pagination, onPaginationChange]
    );

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination,
            ...state,
        },
        enableRowSelection: true,
        manualPagination,
        manualSorting,
        onSortingChange: handleSortingChange,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return {
        table,
        sorting,
        setSorting,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        globalFilter,
        setGlobalFilter,
        pagination,
        setPagination,
    };
}

export function createColumnHelper() {
    return {
        accessor: (accessor, column) => ({
            accessorKey: typeof accessor === 'string' ? accessor : undefined,
            accessorFn: typeof accessor === 'function' ? accessor : undefined,
            ...column,
        }),
        display: (column) => ({
            ...column,
        }),
    };
}
