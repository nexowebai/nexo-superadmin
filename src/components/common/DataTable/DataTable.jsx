import { useMemo, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { Select } from "@components/ui";
import { cn } from "@lib/cn";
import TableToolbar from "./TableToolbar";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useCopyToClipboard } from "@hooks/useCopyToClipboard";
import { CellTooltip } from "./CellTooltip";
import "./DataTable.css";

const SortIcon = ({ isSorted, isSortedDesc }) => (
  <div className={cn("dt-sort-indicator", isSorted && "is-active")}>
    <ArrowUp
      size={12}
      className={cn("dt-arrow dt-arrow-up", isSorted && !isSortedDesc && "active")}
    />
    <ArrowDown
      size={12}
      className={cn("dt-arrow dt-arrow-down", isSorted && isSortedDesc && "active")}
    />
  </div>
);

function DataTable({
  columns: userColumns,
  data = [],
  loading = false,
  emptyIcon: EmptyIcon,
  emptyTitle = "No data found",
  emptyDescription = "",
  onRowClick,
  stickyFirstColumn = true,
  stickyLastColumn = true,
  storageKey,
  title,
  showToolbar = false,
  fileName,
  search,
  onSearchChange,
  onRefresh,
  filters,
  onExportCSV,
  onExportPDF,
  pagination,
  page = 1,
  onPageChange,
}) {
  const tableRef = useRef(null);
  const [copiedId, copyToClipboard] = useCopyToClipboard();
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    storageKey ? `dt-cols-${storageKey}` : null,
    {}
  );
  const [columnSizing, setColumnSizing] = useLocalStorage(
    storageKey ? `dt-widths-${storageKey}` : null,
    {}
  );

  const columns = useMemo(() => {
    return userColumns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: col.label,
      cell: (info) => {
        const value = info.getValue();
        const row = info.row.original;

        if (col.key === "actions") {
          return <div className="dt-actions">{col.render?.(value, row)}</div>;
        }

        let content;
        if (col.copyable && value) {
          content = (
            <div className="dt-copyable">
              <code className="dt-code">{value}</code>
              <button
                className="dt-action-btn dt-copy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(value, `${row.id}-${col.key}`);
                }}
              >
                {copiedId === `${row.id}-${col.key}` ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          );
        } else if (col.render) {
          content = col.render(value, row);
        } else {
          content = value ?? "—";
        }

        if (typeof content === 'string' || typeof content === 'number') {
          return <CellTooltip content={content} />;
        }

        return content;
      },
      enableSorting: col.sortable !== false && col.key !== "actions",
      enableResizing: col.resizable !== false && col.key !== "actions",
      size: col.width || 180,
      minSize: col.minWidth || 120,
      meta: { align: col.align },
    }));
  }, [userColumns, copiedId, copyToClipboard]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    state: {
      columnVisibility,
      columnSizing,
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const handleRowClick = useCallback(
    (row, e) => {
      const target = e.target;
      if (target.closest(".dt-actions") || target.closest("button")) return;
      onRowClick?.(row);
    },
    [onRowClick]
  );

  const handleRowsChange = useCallback(
    (newLimit) => {
      onPageChange?.(1, newLimit);
    },
    [onPageChange]
  );

  const visibleColumns = useMemo(
    () => Object.keys(columnVisibility).filter((key) => columnVisibility[key] !== false),
    [columnVisibility]
  );

  return (
    <div className="dt-root">
      {showToolbar && (
        <TableToolbar
          title={title}
          data={data}
          columns={userColumns}
          visibleColumns={visibleColumns}
          onColumnToggle={(key) =>
            setColumnVisibility((prev) => ({
              ...prev,
              [key]: !prev[key],
            }))
          }
          fileName={fileName}
          printRef={tableRef}
          search={search}
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
          loading={loading}
          filters={filters}
          onExportCSV={onExportCSV}
          onExportPDF={onExportPDF}
        />
      )}

      <div className="dt-container">
        <div className="dt-wrapper" ref={tableRef}>
          <table className="dt-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => {
                    const isFirst = idx === 0 && stickyFirstColumn;
                    const isLast = header.column.id === "actions" && stickyLastColumn;

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "dt-th",
                          isFirst && "dt-th--sticky-left",
                          isLast && "dt-th--sticky-right",
                          header.column.getCanSort() && "dt-th--sortable"
                        )}
                        style={{ width: header.getSize() }}
                      >
                        <div className="dt-th-content">
                          <span
                            className="dt-label"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>

                          {header.column.getCanSort() && (
                            <div
                              className={cn("dt-header-actions", header.column.getCanResize() && "dt-resizer")}
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <SortIcon
                                isSorted={header.column.getIsSorted()}
                                isSortedDesc={header.column.getIsSorted() === "desc"}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, rIdx) => (
                  <tr key={rIdx} className="dt-row dt-row--skeleton">
                    {table.getVisibleLeafColumns().map((col, cIdx) => (
                      <td
                        key={cIdx}
                        className={cn(
                          "dt-td",
                          cIdx === 0 && stickyFirstColumn && "dt-td--sticky-left",
                          col.id === "actions" && stickyLastColumn && "dt-td--sticky-right"
                        )}
                      >
                        {col.id === "actions" ? (
                          <div className="dt-actions">
                            <Skeleton width="32px" height="32px" />
                            <Skeleton width="32px" height="32px" />
                            <Skeleton width="32px" height="32px" />
                          </div>
                        ) : (
                          <Skeleton width="80%" height="18px" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleLeafColumns().length}>
                    <div className="dt-empty">
                      {EmptyIcon && (
                        <div className="dt-empty-icon">
                          <EmptyIcon size={48} />
                        </div>
                      )}
                      <h4 className="dt-empty-title">{emptyTitle}</h4>
                      <p className="dt-empty-description">{emptyDescription}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, rowIdx) => (
                  <motion.tr
                    key={row.id}
                    className={cn("dt-row", onRowClick && "dt-row--clickable")}
                    onClick={(e) => handleRowClick(row.original, e)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(rowIdx * 0.03, 0.15) }}
                  >
                    {row.getVisibleCells().map((cell, colIdx) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "dt-td",
                          colIdx === 0 && stickyFirstColumn && "dt-td--sticky-left",
                          cell.column.id === "actions" && stickyLastColumn && "dt-td--sticky-right",
                          cell.column.columnDef.meta?.align && `dt-td--${cell.column.columnDef.meta.align}`
                        )}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && onPageChange && pagination.total > 0 && (
        <div className="dt-pagination">
          <div className="dt-pagination__left">
            <div className="dt-rows-per-page">
              <span className="dt-rows-per-page__label">Rows:</span>
              <Select
                options={[
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                value={pagination.limit}
                onChange={handleRowsChange}
                fullWidth={false}
              />
            </div>
            <div className="dt-pagination__info">
              Showing{" "}
              <span className="dt-pagination__info--bold">
                {(page - 1) * pagination.limit + 1}
              </span>{" "}
              -{" "}
              <span className="dt-pagination__info--bold">
                {Math.min(page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="dt-pagination__info--bold">{pagination.total}</span>
            </div>
          </div>

          <div className="dt-pagination__right">
            <nav className="dt-pagination__nav">
              <button
                className="dt-nav-btn"
                disabled={page === 1}
                onClick={() => onPageChange(1, pagination.limit)}
                title="First Page"
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                className="dt-nav-btn"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1, pagination.limit)}
                title="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="dt-page-numbers">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.pages ||
                      Math.abs(p - page) <= 1
                  )
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ell-${i}`} className="dt-page-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={cn("dt-page-btn", page === p && "dt-page-btn--active")}
                        onClick={() => onPageChange(p, pagination.limit)}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                className="dt-nav-btn"
                disabled={page === pagination.pages}
                onClick={() => onPageChange(page + 1, pagination.limit)}
                title="Next Page"
              >
                <ChevronRight size={18} />
              </button>
              <button
                className="dt-nav-btn"
                disabled={page === pagination.pages}
                onClick={() => onPageChange(pagination.pages, pagination.limit)}
                title="Last Page"
              >
                <ChevronsRight size={18} />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;